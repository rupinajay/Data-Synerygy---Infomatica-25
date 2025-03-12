import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataService, DataSourceInfo, SchemaInfo, TableInfo } from '@/services/dataService';
import { toast } from 'sonner';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Database, 
  RefreshCw, 
  Settings, 
  Shield,
  Table as TableIcon,
  FileJson,
  Upload,
  Download,
  BarChart,
  Layers,
  Loader2,
  MoveLeft
} from 'lucide-react';
import DirectQueryInput from '@/components/query/DirectQueryInput';

interface DataSourceDetailProps {
  dataSourceId: string;
  onBack?: () => void;
}

const DataSourceDetail: React.FC<DataSourceDetailProps> = ({ dataSourceId, onBack }) => {
  const [dataSource, setDataSource] = useState<DataSourceInfo | null>(null);
  const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [schemaLoading, setSchemaLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [qualityAnalysis, setQualityAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    const loadDataSource = async () => {
      try {
        setLoading(true);
        const source = await DataService.getDataSourceById(dataSourceId);
        if (source) {
          setDataSource(source);
        } else {
          toast.error("Data source not found");
          if (onBack) onBack();
        }
      } catch (error) {
        console.error("Error loading data source:", error);
        toast.error("Failed to load data source");
      } finally {
        setLoading(false);
      }
    };

    loadDataSource();
  }, [dataSourceId, onBack]);

  useEffect(() => {
    if (dataSource && activeTab === 'schema') {
      loadSchemas();
    }
  }, [dataSource, activeTab]);

  const loadSchemas = async () => {
    if (!dataSource) return;
    
    try {
      setSchemaLoading(true);
      const schemaData = await DataService.getDatabaseSchemas(dataSource.id);
      setSchemas(schemaData);
    } catch (error) {
      console.error("Error loading schemas:", error);
      toast.error("Failed to load database schemas");
    } finally {
      setSchemaLoading(false);
    }
  };

  const handleExportSchema = async () => {
    if (!dataSource) return;
    
    try {
      setIsExporting(true);
      const result = await DataService.exportDatabaseSchema(dataSource.id);
      if (result && typeof result === 'object' && 'success' in result && 'data' in result && result.success) {
        const jsonStr = JSON.stringify(result.data, null, 2);
        
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataSource.name.replace(/\s+/g, '_')}_schema.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Schema exported successfully");
      } else {
        toast.error("Failed to export schema: Invalid response format");
      }
    } catch (error) {
      console.error("Error exporting schema:", error);
      toast.error("Failed to export schema");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAnalyzeQuality = async () => {
    if (!dataSource) return;
    
    try {
      setIsAnalyzing(true);
      const analysis = await DataService.analyzeDataQuality(dataSource.id);
      setQualityAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing data quality:", error);
      toast.error("Failed to analyze data quality");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStatuBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Connected</Badge>;
      case 'syncing':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Syncing</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Error</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Settings className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dataSource) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Data source not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <MoveLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{dataSource.name}</h2>
          {renderStatuBadge(dataSource.status)}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="query">Direct Query</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-sm font-medium">Type</div>
                  <div className="text-sm capitalize">{dataSource.type}</div>
                  
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm flex items-center">
                    {renderStatusIcon(dataSource.status)}
                    <span className="ml-1 capitalize">{dataSource.status}</span>
                  </div>
                  
                  <div className="text-sm font-medium">Last Sync</div>
                  <div className="text-sm">{dataSource.lastSync || 'Never'}</div>
                  
                  <div className="text-sm font-medium">Record Count</div>
                  <div className="text-sm">{dataSource.recordCount?.toLocaleString() || 'Unknown'}</div>
                </div>
                
                {dataSource.connectionDetails && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-2">Connection String</h4>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {dataSource.type === 'postgresql' ? 
                        `postgresql://${dataSource.connectionDetails.username}:******@${dataSource.connectionDetails.host}:${dataSource.connectionDetails.port}/${dataSource.connectionDetails.database}` : 
                      dataSource.type === 'mysql' ? 
                        `mysql://${dataSource.connectionDetails.username}:******@${dataSource.connectionDetails.host}:${dataSource.connectionDetails.port}/${dataSource.connectionDetails.database}` :
                      dataSource.type === 'mongodb' ? 
                        `mongodb://${dataSource.connectionDetails.username}:******@${dataSource.connectionDetails.host}:${dataSource.connectionDetails.port}/${dataSource.connectionDetails.database}` :
                        `${dataSource.type}://${dataSource.connectionDetails.host}:${dataSource.connectionDetails.port}`}
                    </pre>
                  </div>
                )}
                
                {dataSource.message && (
                  <Alert variant={dataSource.status === 'error' ? 'destructive' : 'default'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{dataSource.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Quality</CardTitle>
                <CardDescription>
                  Overall quality score of the data source
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm font-bold">{dataSource.qualityScore || 0}%</span>
                  </div>
                  <Progress value={dataSource.qualityScore || 0} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-md p-3 flex flex-col">
                    <span className="text-xs text-muted-foreground">Tables</span>
                    <span className="text-lg font-bold">{schemas.reduce((acc, schema) => acc + schema.tables.length, 0) || "..."}</span>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col">
                    <span className="text-xs text-muted-foreground">Total Records</span>
                    <span className="text-lg font-bold">{dataSource.recordCount?.toLocaleString() || "..."}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('quality')}>
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <RefreshCw className="h-5 w-5 mb-2" />
                  <span className="text-sm">Sync Now</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={() => setActiveTab('query')}>
                  <Database className="h-5 w-5 mb-2" />
                  <span className="text-sm">Run Query</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center" onClick={handleExportSchema}>
                  <Download className="h-5 w-5 mb-2" />
                  <span className="text-sm">Export Schema</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                  <Shield className="h-5 w-5 mb-2" />
                  <span className="text-sm">Access Control</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Database Schema</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={loadSchemas}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportSchema} disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileJson className="h-4 w-4 mr-2" />
                    Export Schema
                  </>
                )}
              </Button>
            </div>
          </div>

          {schemaLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : schemas.length > 0 ? (
            <div className="space-y-6">
              {schemas.map((schema, schemaIndex) => (
                <Card key={schemaIndex}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Schema: {schema.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schema.tables.map((table, tableIndex) => (
                        <div key={tableIndex} className="border rounded-md overflow-hidden">
                          <div className="bg-muted/50 p-3 flex justify-between items-center border-b">
                            <div className="flex items-center">
                              <TableIcon className="h-4 w-4 mr-2" />
                              <span className="font-medium">{table.name}</span>
                            </div>
                            <Badge variant="outline">{table.rowCount.toLocaleString()} rows</Badge>
                          </div>
                          <div className="p-2 overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-muted-foreground">
                                  <th className="text-left p-2 font-medium">Column</th>
                                  <th className="text-left p-2 font-medium">Type</th>
                                  <th className="text-left p-2 font-medium">Attributes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {table.columns.map((column, columnIndex) => (
                                  <tr key={columnIndex} className="border-t">
                                    <td className="p-2">
                                      <div className="flex items-center">
                                        {column.isPrimary && (
                                          <span className="text-xs bg-amber-100 text-amber-800 rounded px-1 mr-2">PK</span>
                                        )}
                                        {column.isForeign && (
                                          <span className="text-xs bg-blue-100 text-blue-800 rounded px-1 mr-2">FK</span>
                                        )}
                                        {column.name}
                                      </div>
                                    </td>
                                    <td className="p-2 text-muted-foreground">{column.type}</td>
                                    <td className="p-2">
                                      {column.isNullable ? '' : 'NOT NULL'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Database className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No schema information available</p>
                {dataSource.type !== 'csv' && dataSource.type !== 'api' && (
                  <Button variant="outline" className="mt-4" onClick={loadSchemas}>
                    <Upload className="h-4 w-4 mr-2" />
                    Load Schema
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="query" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Run Direct Query</CardTitle>
              <CardDescription>
                Execute queries directly against {dataSource.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataSource && <DirectQueryInput dataSource={dataSource} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Data Quality Analysis</h3>
            <Button 
              onClick={handleAnalyzeQuality} 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>

          {isAnalyzing ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : qualityAnalysis ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">
                    Quality Score: {qualityAnalysis.qualityScore}%
                  </CardTitle>
                  <CardDescription>
                    {qualityAnalysis.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-bold">{qualityAnalysis.qualityScore}%</span>
                      </div>
                      <Progress value={qualityAnalysis.qualityScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">
                    Detected Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {qualityAnalysis.issues.map((issue: any, index: number) => (
                      <div key={index} className={`border rounded-md p-4 
                        ${issue.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800' : 
                          issue.severity === 'medium' ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800' : 
                          'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800'}`}>
                        <div className="flex items-start">
                          <div className={`rounded-full p-1 mr-3 mt-0.5 
                            ${issue.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' : 
                              issue.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200' : 
                              'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'}`}>
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className={`font-medium mb-1 
                              ${issue.severity === 'high' ? 'text-red-700 dark:text-red-200' : 
                                issue.severity === 'medium' ? 'text-amber-700 dark:text-amber-200' : 
                                'text-blue-700 dark:text-blue-200'}`}>
                              {issue.issue}
                            </h4>
                            <p className="text-sm opacity-90">
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Run an analysis to see data quality details</p>
                <Button className="mt-4" onClick={handleAnalyzeQuality}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceDetail;
