
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart as LineChartIcon, 
  BarChart as BarChartIcon, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell } from "recharts";

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("week");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["analyticsData", timeRange],
    queryFn: async () => {
      // Mock data - in a real app, this would come from an API
      return {
        revenueData: [
          { name: "Jan", value: 4000 },
          { name: "Feb", value: 3000 },
          { name: "Mar", value: 5000 },
          { name: "Apr", value: 2780 },
          { name: "May", value: 1890 },
          { name: "Jun", value: 2390 },
          { name: "Jul", value: 3490 },
          { name: "Aug", value: 4000 },
          { name: "Sep", value: 4500 },
          { name: "Oct", value: 5200 },
          { name: "Nov", value: 4800 },
          { name: "Dec", value: 6000 },
        ],
        userEngagementData: [
          { name: "Mon", users: 2400, sessions: 4000 },
          { name: "Tue", users: 1398, sessions: 3000 },
          { name: "Wed", users: 9800, sessions: 2000 },
          { name: "Thu", users: 3908, sessions: 2780 },
          { name: "Fri", users: 4800, sessions: 1890 },
          { name: "Sat", users: 3800, sessions: 2390 },
          { name: "Sun", users: 4300, sessions: 3490 },
        ],
        customerData: [
          { name: "New", value: 400 },
          { name: "Returning", value: 300 },
          { name: "Inactive", value: 300 },
          { name: "Churned", value: 200 },
        ],
        kpiData: [
          { name: "Revenue", value: "$237,500", change: "+12.5%", trend: "up" },
          { name: "Users", value: "12,543", change: "+7.2%", trend: "up" },
          { name: "Conversion", value: "3.8%", change: "-0.5%", trend: "down" },
          { name: "Avg. Session", value: "2:15", change: "+0.8%", trend: "up" },
        ],
      };
    },
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-gradient">Analytics</h1>
          
          <div className="flex items-center gap-2">
            <Tabs value={timeRange} onValueChange={setTimeRange} className="mr-2">
              <TabsList className="glass-tab-list">
                <TabsTrigger value="week" className="glass-tab">Week</TabsTrigger>
                <TabsTrigger value="month" className="glass-tab">Month</TabsTrigger>
                <TabsTrigger value="quarter" className="glass-tab">Quarter</TabsTrigger>
                <TabsTrigger value="year" className="glass-tab">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {data?.kpiData.map((kpi, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{kpi.name}</h3>
                    <span className={`flex items-center text-xs ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {kpi.change}
                    </span>
                  </div>
                  <div className="text-2xl font-semibold">{kpi.value}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Revenue Trends</h3>
                    <p className="text-sm text-muted-foreground">Monthly revenue performance</p>
                  </div>
                  <LineChartIcon className="h-5 w-5 text-primary/80" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: '#999' }} />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#3c3c3e' }} />
                      <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">User Engagement</h3>
                    <p className="text-sm text-muted-foreground">Weekly active users and sessions</p>
                  </div>
                  <BarChartIcon className="h-5 w-5 text-primary/80" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.userEngagementData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" tick={{ fill: '#999' }} />
                      <YAxis tick={{ fill: '#999' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#3c3c3e' }} />
                      <Bar dataKey="users" fill="#0088FE" />
                      <Bar dataKey="sessions" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass-card p-6 lg:col-span-1">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Customer Segments</h3>
                    <p className="text-sm text-muted-foreground">Distribution by type</p>
                  </div>
                  <PieChart className="h-5 w-5 text-primary/80" />
                </div>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={data?.customerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data?.customerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1c1c1e', borderColor: '#3c3c3e' }} />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass-card p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Quick Insights</h3>
                    <p className="text-sm text-muted-foreground">AI-generated data observations</p>
                  </div>
                  <Calendar className="h-5 w-5 text-primary/80" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 glass-panel rounded-lg">
                    <h4 className="font-medium mb-2 text-primary/90">Revenue Growth Acceleration</h4>
                    <p className="text-sm text-muted-foreground">There's a 15% increase in revenue growth rate compared to the previous period, primarily driven by new product lines and expanded market reach.</p>
                  </div>
                  <div className="p-4 glass-panel rounded-lg">
                    <h4 className="font-medium mb-2 text-primary/90">User Engagement Pattern</h4>
                    <p className="text-sm text-muted-foreground">Tuesday and Wednesday show the highest user engagement, suggesting optimal timing for new feature releases and marketing campaigns.</p>
                  </div>
                  <div className="p-4 glass-panel rounded-lg">
                    <h4 className="font-medium mb-2 text-primary/90">Customer Retention Opportunity</h4>
                    <p className="text-sm text-muted-foreground">The 33% inactive user segment represents a significant opportunity for re-engagement campaigns and targeted promotions.</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
