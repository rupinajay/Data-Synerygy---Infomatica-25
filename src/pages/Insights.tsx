import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightCard from '@/components/ui/insights/InsightCard';
import { 
  DataService, 
  InsightData,
  QueryResult
} from '@/services/dataService';
import { 
  Filter, 
  Search, 
  ArrowUpDown,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import QueryInput from '@/components/query/QueryInput';
import QueryResultCard from '@/components/query/QueryResult';
import EnhancedQueryResult from '@/components/query/EnhancedQueryResult';
import { ProcessedResult } from '@/services/informaticaService';

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<ProcessedResult | null>(null);
  
  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        const data = await DataService.getInsights();
        setInsights(data);
      } catch (error) {
        console.error('Error loading insights:', error);
        toast.error('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };
    
    loadInsights();
  }, []);
  
  const handleQueryComplete = (result: QueryResult) => {
    setQueryResult(result);
    
    // Add new insights to our list
    if (result.insights && result.insights.length > 0) {
      setInsights(prevInsights => {
        // Create new insight objects from strings
        const newInsights = result.insights.map((insightText, index) => ({
          id: `generated-${Date.now()}-${index}`,
          title: insightText.split('.')[0] || 'New Insight',
          content: insightText,
          category: 'AI-Generated',
          date: new Date().toISOString(),
          sources: result.sources || []
        }));
        
        return [...newInsights, ...prevInsights];
      });
    }
  };
  
  const handleInformaticaResult = (result: ProcessedResult) => {
    setEnhancedResult(result);
    
    // You could also generate insights based on the enhanced result
    // This would depend on the structure of your Informatica response
  };
  
  const filteredInsights = insights.filter(insight => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      insight.title.toLowerCase().includes(query) ||
      insight.content.toLowerCase().includes(query) ||
      insight.category.toLowerCase().includes(query)
    );
  });
  
  const refreshInsights = async () => {
    try {
      toast.info('Refreshing insights...');
      setLoading(true);
      
      // Simulate a delay for the refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = await DataService.getInsights();
      setInsights(data);
      toast.success('Insights refreshed');
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast.error('Failed to refresh insights');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
                <p className="text-muted-foreground mt-1">
                  Automatically generated insights from your connected data sources
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={refreshInsights}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate New Insights
                </CardTitle>
                <CardDescription>
                  Ask questions about your business data to generate new insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInput 
                  onQueryComplete={handleQueryComplete} 
                  onInformaticaResult={handleInformaticaResult}
                />
                
                {/* Show the enhanced result when available */}
                {enhancedResult && (
                  <div className="mt-4">
                    <EnhancedQueryResult result={enhancedResult} />
                  </div>
                )}
                
                {/* Fallback to the standard result if enhanced is not available */}
                {!enhancedResult && queryResult && (
                  <div className="mt-4">
                    <QueryResultCard result={queryResult} />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search insights..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(6).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden h-full animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-4 w-20 bg-muted rounded-md" />
                          <div className="h-6 w-40 bg-muted rounded-md mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-2/3 bg-muted rounded-md" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredInsights.length > 0 ? (
                    filteredInsights.map((insight, index) => (
                      <InsightCard
                        key={insight.id || index}
                        title={insight.title}
                        content={insight.content}
                        sources={insight.sources}
                        date={insight.date}
                        category={insight.category}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No insights found</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        {searchQuery ? 
                          "No insights match your search criteria. Try adjusting your search or clear the filter." :
                          "There are no insights to display. Generate new insights by asking questions about your data."}
                      </p>
                      {searchQuery && (
                        <Button 
                          variant="outline"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sales" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden h-full animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-4 w-20 bg-muted rounded-md" />
                          <div className="h-6 w-40 bg-muted rounded-md mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-2/3 bg-muted rounded-md" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredInsights
                      .filter(insight => 
                        insight.category.toLowerCase().includes('sales') || 
                        insight.category.toLowerCase().includes('revenue') ||
                        insight.category.toLowerCase().includes('forecast')
                      )
                      .map((insight, index) => (
                        <InsightCard
                          key={insight.id || index}
                          title={insight.title}
                          content={insight.content}
                          sources={insight.sources}
                          date={insight.date}
                          category={insight.category}
                        />
                      ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="product" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden h-full animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-4 w-20 bg-muted rounded-md" />
                          <div className="h-6 w-40 bg-muted rounded-md mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-2/3 bg-muted rounded-md" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredInsights
                      .filter(insight => 
                        insight.category.toLowerCase().includes('product') || 
                        insight.category.toLowerCase().includes('feature') ||
                        insight.category.toLowerCase().includes('analytics')
                      )
                      .map((insight, index) => (
                        <InsightCard
                          key={insight.id || index}
                          title={insight.title}
                          content={insight.content}
                          sources={insight.sources}
                          date={insight.date}
                          category={insight.category}
                        />
                      ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="customer" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(2).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden h-full animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-4 w-20 bg-muted rounded-md" />
                          <div className="h-6 w-40 bg-muted rounded-md mt-2" />
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-full bg-muted rounded-md" />
                            <div className="h-4 w-2/3 bg-muted rounded-md" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredInsights
                      .filter(insight => 
                        insight.category.toLowerCase().includes('customer') || 
                        insight.category.toLowerCase().includes('success') ||
                        insight.category.toLowerCase().includes('churn')
                      )
                      .map((insight, index) => (
                        <InsightCard
                          key={insight.id || index}
                          title={insight.title}
                          content={insight.content}
                          sources={insight.sources}
                          date={insight.date}
                          category={insight.category}
                        />
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Insights;
