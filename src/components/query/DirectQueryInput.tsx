import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Code, Copy, Database, Play, Zap, Table, BarChart, PanelRight, Info } from 'lucide-react';
import { DataSourceInfo, DirectQueryResult, DataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import QueryResult from './QueryResult';

interface DirectQueryInputProps {
  dataSource: DataSourceInfo;
}

interface OptimizedQueryResult {
  success: boolean;
  optimizedQuery: string;
  improvementNotes?: string;
}

const DirectQueryInput: React.FC<DirectQueryInputProps> = ({ dataSource }) => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<DirectQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [resultView, setResultView] = useState<'table' | 'json' | 'chart'>('table');
  const [sampleQueries, setSampleQueries] = useState<string[]>([]);
  const { toast } = useToast();

  // Load sample queries
  React.useEffect(() => {
    const loadSampleQueries = async () => {
      try {
        const queries = await DataService.getSampleQueries(dataSource.type);
        setSampleQueries(queries);
        
        // Set a default query if available
        if (queries.length > 0 && !query) {
          setQuery(queries[0]);
        }
      } catch (error) {
        console.error('Error loading sample queries:', error);
      }
    };
    
    loadSampleQueries();
  }, [dataSource.type]);

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Query is empty",
        description: "Please enter a SQL query to execute."
      });
      return;
    }
    
    try {
      setIsExecuting(true);
      const result = await DataService.executeQuery(dataSource.id, query);
      setResult(result);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error executing query",
        description: error.message || "An error occurred while executing the query."
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query);
    toast({
      description: "Query copied to clipboard."
    });
  };

  const handleOptimizeQuery = async () => {
    try {
      const response = await DataService.generateOptimizedQuery(query, dataSource.id);
      
      // Parse response to ensure it matches the expected structure
      const result = response as OptimizedQueryResult;
      
      if (result.success) {
        setQuery(result.optimizedQuery);
        toast({
          title: "Query optimized",
          description: "The query has been optimized for better performance."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error optimizing query",
        description: error.message || "An error occurred while optimizing the query."
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Query Editor</CardTitle>
              <CardDescription>
                Directly query {dataSource.name} with SQL
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyQuery}
                title="Copy query"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOptimizeQuery}
                title="Optimize query"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea 
            className="font-mono min-h-32"
            placeholder={`Enter SQL query for ${dataSource.type}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={executeQuery} 
                disabled={isExecuting || !query.trim()}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Execute Query
              </Button>
              <Button 
                variant="outline"
                onClick={() => setQuery('')}
                disabled={!query.trim()}
              >
                Clear
              </Button>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled={!result} onClick={() => setResultView('table')}>
                <Table className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={() => setResultView('json')}>
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={!result} onClick={() => setResultView('chart')}>
                <BarChart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {result && (
            <div className="mt-4">
              <Separator className="my-4" />
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">
                  Results ({result.rowCount} rows, {result.queryTime.toFixed(3)}s)
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
                  Clear Results
                </Button>
              </div>
              
              {resultView === 'table' && (
                <div className="border rounded-md overflow-auto max-h-96">
                  <table className="w-full min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        {result.columns.map((column, i) => (
                          <th key={i} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {result.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 whitespace-nowrap text-sm">
                              {cell !== null ? String(cell) : <span className="text-muted-foreground italic">null</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {resultView === 'json' && (
                <div className="font-mono text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
                  <pre>{JSON.stringify({ columns: result.columns, rows: result.rows }, null, 2)}</pre>
                </div>
              )}
              
              {resultView === 'chart' && (
                <div className="p-4 border rounded-md text-center h-64 flex items-center justify-center">
                  <div className="text-muted-foreground">
                    <BarChart className="h-8 w-8 mx-auto mb-2" />
                    <p>Visualization feature coming soon.</p>
                    <p className="text-xs mt-1">You'll be able to visualize your query results as charts.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {sampleQueries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Sample Queries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {sampleQueries.map((sampleQuery, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded-md bg-muted cursor-pointer hover:bg-accent text-sm font-mono"
                  onClick={() => setQuery(sampleQuery)}
                >
                  {sampleQuery}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DirectQueryInput;
