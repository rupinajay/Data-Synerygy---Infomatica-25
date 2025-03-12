import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataService, DataSourceInfo } from '@/services/dataService';
import { 
  Database, 
  RefreshCw, 
  Search, 
  PlusCircle, 
  FileText, 
  Users, 
  TrendingUp, 
  Snowflake,
  CheckCircle2,
  AlertCircle,
  Settings,
  Trash2,
  ExternalLink,
  Clock,
  Layers,
  Shield,
  DownloadCloud
} from 'lucide-react';
import { toast } from 'sonner';

const DataSources: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const loadDataSources = async () => {
      try {
        setLoading(true);
        const data = await DataService.getDataSources();
        setDataSources(data);
      } catch (error) {
        console.error('Error loading data sources:', error);
        toast.error('Failed to load data sources');
      } finally {
        setLoading(false);
      }
    };
    
    loadDataSources();
  }, []);
  
  const filteredDataSources = dataSources.filter(source => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return source.name.toLowerCase().includes(query);
  });
  
  const refreshDataSources = async () => {
    try {
      toast.info('Refreshing data sources...');
      setLoading(true);
      
      await DataService.refreshDataSources();
      
      const data = await DataService.getDataSources();
      setDataSources(data);
    } catch (error) {
      console.error('Error refreshing data sources:', error);
      toast.error('Failed to refresh data sources');
    } finally {
      setLoading(false);
    }
  };
  
  const renderSourceIcon = (source: DataSourceInfo) => {
    if (source.icon) {
      const icons: Record<string, React.ReactNode> = {
        'Database': <Database className="h-5 w-5" />,
        'FileText': <FileText className="h-5 w-5" />,
        'Users': <Users className="h-5 w-5" />,
        'TrendingUp': <TrendingUp className="h-5 w-5" />,
        'Snowflake': <Snowflake className="h-5 w-5" />
      };
      
      return icons[source.icon] || <Database className="h-5 w-5" />;
    }
    
    switch (source.type) {
      case 'csv':
        return <FileText className="h-5 w-5" />;
      case 'api':
        return <TrendingUp className="h-5 w-5" />;
      case 'snowflake':
        return <Snowflake className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };
  
  const renderDetailedSourceCard = (source: DataSourceInfo) => {
    const statusColors = {
      connected: 'bg-green-500',
      syncing: 'bg-amber-500',
      error: 'bg-red-500',
      maintenance: 'bg-blue-500'
    };
    
    const statusIcons = {
      connected: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      syncing: <Clock className="h-5 w-5 text-amber-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      maintenance: <Settings className="h-5 w-5 text-blue-500" />
    };
    
    const typeLabels: Record<string, string> = {
      'snowflake': 'Data Warehouse',
      'salesforce': 'CRM',
      'csv': 'Flat File',
      'marketapi': 'External API'
    };
    
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2">
              {typeLabels[source.type] || source.type}
            </Badge>
            <div className="flex items-center gap-1">
              {statusIcons[source.status]}
              <span className="text-sm font-medium capitalize">{source.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              {renderSourceIcon(source)}
            </div>
            <div>
              <CardTitle>{source.name}</CardTitle>
              <CardDescription>
                {source.lastSync ? `Last updated: ${source.lastSync}` : 'Not synced yet'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {source.message && (
            <div className={`p-3 rounded-md ${source.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
              <p className="text-sm">{source.message}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Records</p>
              <p className="font-semibold">{source.recordCount?.toLocaleString() || 'N/A'}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Data Quality</p>
                <p className="text-sm font-medium">{source.qualityScore || 0}%</p>
              </div>
              <Progress value={source.qualityScore} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="border rounded-md p-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs">Access Control</div>
            </div>
            
            <div className="border rounded-md p-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs">Schema</div>
            </div>
            
            <div className="border rounded-md p-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs">Sync Schedule</div>
            </div>
            
            <div className="border rounded-md p-2 flex items-center gap-2">
              <DownloadCloud className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs">Download</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
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
                <h2 className="text-3xl font-bold tracking-tight">Data Sources</h2>
                <p className="text-muted-foreground mt-1">
                  Manage your connected data sources and integrations
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={refreshDataSources}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Source</span>
                </Button>
              </div>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search data sources..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="databases">Databases</TabsTrigger>
                <TabsTrigger value="snowflake">Snowflake</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(4).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden animate-pulse">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="h-5 w-20 bg-muted rounded-md" />
                            <div className="h-5 w-24 bg-muted rounded-md" />
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-12 w-12 bg-muted rounded-md" />
                            <div>
                              <div className="h-6 w-40 bg-muted rounded-md" />
                              <div className="h-4 w-32 bg-muted rounded-md mt-2" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="h-4 w-20 bg-muted rounded-md" />
                                <div className="h-5 w-24 bg-muted rounded-md" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded-md" />
                                <div className="h-2 w-full bg-muted rounded-md" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : filteredDataSources.length > 0 ? (
                    filteredDataSources.map((source) => (
                      <div key={source.id}>
                        {renderDetailedSourceCard(source)}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <Database className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No data sources found</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        {searchQuery ? 
                          "No data sources match your search criteria. Try adjusting your search or clear the filter." :
                          "You haven't added any data sources yet. Add a new data source to get started."}
                      </p>
                      {searchQuery ? (
                        <Button 
                          variant="outline"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <Button className="gap-2">
                          <PlusCircle className="h-4 w-4" />
                          <span>Add Data Source</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="databases" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(1).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden animate-pulse">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="h-5 w-20 bg-muted rounded-md" />
                            <div className="h-5 w-24 bg-muted rounded-md" />
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-12 w-12 bg-muted rounded-md" />
                            <div>
                              <div className="h-6 w-40 bg-muted rounded-md" />
                              <div className="h-4 w-32 bg-muted rounded-md mt-2" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="h-4 w-20 bg-muted rounded-md" />
                                <div className="h-5 w-24 bg-muted rounded-md" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded-md" />
                                <div className="h-2 w-full bg-muted rounded-md" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredDataSources
                      .filter(source => ['mysql', 'postgresql', 'mongodb', 'oracle', 'sqlserver', 'sqlite'].includes(source.type))
                      .map((source) => (
                        <div key={source.id}>
                          {renderDetailedSourceCard(source)}
                        </div>
                      ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="snowflake" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(1).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden animate-pulse">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="h-5 w-20 bg-muted rounded-md" />
                            <div className="h-5 w-24 bg-muted rounded-md" />
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-12 w-12 bg-muted rounded-md" />
                            <div>
                              <div className="h-6 w-40 bg-muted rounded-md" />
                              <div className="h-4 w-32 bg-muted rounded-md mt-2" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="h-4 w-20 bg-muted rounded-md" />
                                <div className="h-5 w-24 bg-muted rounded-md" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded-md" />
                                <div className="h-2 w-full bg-muted rounded-md" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredDataSources
                      .filter(source => source.type === 'snowflake')
                      .map((source) => (
                        <div key={source.id}>
                          {renderDetailedSourceCard(source)}
                        </div>
                      ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading ? (
                    Array(1).fill(0).map((_, index) => (
                      <Card key={index} className="overflow-hidden animate-pulse">
                        <CardHeader>
                          <div className="flex justify-between">
                            <div className="h-5 w-20 bg-muted rounded-md" />
                            <div className="h-5 w-24 bg-muted rounded-md" />
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="h-12 w-12 bg-muted rounded-md" />
                            <div>
                              <div className="h-6 w-40 bg-muted rounded-md" />
                              <div className="h-4 w-32 bg-muted rounded-md mt-2" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="h-4 w-20 bg-muted rounded-md" />
                                <div className="h-5 w-24 bg-muted rounded-md" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded-md" />
                                <div className="h-2 w-full bg-muted rounded-md" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    filteredDataSources
                      .filter(source => source.type === 'csv')
                      .map((source) => (
                        <div key={source.id}>
                          {renderDetailedSourceCard(source)}
                        </div>
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

export default DataSources;
