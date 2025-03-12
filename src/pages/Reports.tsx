
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileCog, Filter, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { DataService } from "@/services/dataService";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  lastRun: string;
  status: "completed" | "scheduled" | "failed";
};

const Reports: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      // Mock report data since we don't have a real API
      return [
        {
          id: "rep-001",
          title: "Monthly Sales Performance",
          description: "Comprehensive analysis of sales data across all regions",
          category: "sales",
          createdAt: "2023-09-15",
          lastRun: "2023-10-01",
          status: "completed"
        },
        {
          id: "rep-002",
          title: "Customer Acquisition Cost",
          description: "Analysis of marketing spend vs. new customers",
          category: "marketing",
          createdAt: "2023-08-22",
          lastRun: "2023-09-28",
          status: "completed"
        },
        {
          id: "rep-003",
          title: "Inventory Turnover Rate",
          description: "Stock movement and warehousing efficiency report",
          category: "operations",
          createdAt: "2023-07-10",
          lastRun: "2023-10-02",
          status: "failed"
        },
        {
          id: "rep-004",
          title: "Employee Productivity",
          description: "Department performance and resource allocation",
          category: "hr",
          createdAt: "2023-09-01",
          lastRun: "2023-09-30",
          status: "scheduled"
        },
        {
          id: "rep-005",
          title: "Product Profitability",
          description: "Margin analysis by product line and SKU",
          category: "finance",
          createdAt: "2023-08-15",
          lastRun: "2023-09-15",
          status: "completed"
        },
        {
          id: "rep-006",
          title: "Website Traffic Analysis",
          description: "User engagement and conversion metrics",
          category: "marketing",
          createdAt: "2023-09-20",
          lastRun: "2023-10-03",
          status: "completed"
        }
      ] as Report[];
    },
  });

  const categories = ["all", "sales", "marketing", "operations", "finance", "hr"];

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(filter.toLowerCase()) || 
                         report.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === "all" || report.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400";
      case "scheduled": return "text-blue-400";
      case "failed": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-medium tracking-tight text-gradient">Reports</h1>
          
          <div className="flex items-center gap-2 self-end">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 w-64 glass-input"
              />
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="glass-button"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="glass-tab-list mb-6">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="glass-tab capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="animate-fade-in">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReports.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No reports found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="glass-card overflow-hidden hover:border-primary/30 transition-colors duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <BarChart3 className="h-6 w-6 text-primary/80" />
                          <span className={`text-sm font-medium ${getStatusColor(report.status)} capitalize`}>
                            {report.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium mb-2 line-clamp-1">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{report.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Last run: {report.lastRun}</span>
                          <span className="capitalize">{report.category}</span>
                        </div>
                      </div>
                      <div className="border-t border-border px-6 py-4 bg-card/30 backdrop-blur-sm">
                        <Button variant="ghost" size="sm" className="text-primary w-full">
                          <FileCog className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
