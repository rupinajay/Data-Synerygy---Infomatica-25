
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StatusCard from '@/components/ui/dashboard/StatusCard';
import MetricsCard from '@/components/ui/dashboard/MetricsCard';
import DataSourceCard from '@/components/ui/dashboard/DataSourceCard';
import InsightCard from '@/components/ui/insights/InsightCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Rocket, Sparkles, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataSourceInfo, DashboardData, DataService, QueryResult } from '@/services/dataService';
import { toast } from 'sonner';
import QueryInput from '@/components/query/QueryInput';
import QueryResultCard from '@/components/query/QueryResult';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await DataService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuerySubmit = async (userQuery: string) => {
    setIsProcessingQuery(true);
    try {
      const result = await DataService.processQuery(userQuery);
      setQueryResult(result);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Failed to process your query');
    } finally {
      setIsProcessingQuery(false);
    }
  };

  // Handle system status type conversion from KPI status
  const mapStatusToSystemStatus = (status: 'up' | 'down' | 'neutral'): 'positive' | 'negative' | 'neutral' => {
    if (status === 'up') return 'positive';
    if (status === 'down') return 'negative';
    return 'neutral';
  };

  if (isFetchingData) {
    return <div className="flex items-center justify-center h-96">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" onClick={() => navigate('/data-sources')}>
            View All Data Sources
          </Button>
          <Button onClick={() => navigate('/insights')}>
            View All Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Top Insights</TabsTrigger>
          <TabsTrigger value="query">Query Your Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(dashboardData.kpis).map(([name, data]) => (
                  <StatusCard 
                    key={name}
                    title={name}
                    value={typeof data.value === 'number' ? 
                      name.toLowerCase().includes('rate') || name.toLowerCase().includes('percentage') ? 
                        `${data.value}%` : data.value.toLocaleString() 
                      : String(data.value)}
                    delta={data.change}
                    status={mapStatusToSystemStatus(data.status)}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Rocket className="mr-2 h-5 w-5 text-blue-500" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(dashboardData.metrics).map(([name, value]) => (
                        <MetricsCard 
                          key={name}
                          title={name}
                          value={String(value)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                      Data Sources
                    </CardTitle>
                    <CardDescription>
                      Connected data sources and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.dataSources.slice(0, 3).map((source) => (
                        <DataSourceCard 
                          key={source.id}
                          name={source.name}
                          status={source.status}
                          type={source.type}
                          lastSync={source.lastSync}
                          recordCount={source.recordCount}
                          qualityScore={source.qualityScore}
                          icon={source.icon}
                          onClick={() => navigate(`/data-sources/${source.id}`)}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/data-sources')}>
                      View All Data Sources <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.insights.map((insight) => (
                <InsightCard 
                  key={insight.id}
                  title={insight.title}
                  content={insight.content}
                  category={insight.category}
                  date={insight.date}
                  sources={insight.sources}
                />
              ))}
            </div>
          )}
          
          <div className="flex justify-center">
            <Button onClick={() => navigate('/insights')}>
              View All Insights <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="query" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                Query Your Data
              </CardTitle>
              <CardDescription>
                Ask natural language questions about your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                Example: What were our top 5 customers by revenue last quarter?
              </div>
              <QueryInput 
                onQueryComplete={setQueryResult}
              />
            </CardContent>
          </Card>
          
          {queryResult && (
            <QueryResultCard result={queryResult} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
