
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Snowflake, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Database, 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';
import { DataSourceInfo, DataService } from '@/services/dataService';
import { toast } from 'sonner';

interface SnowflakeAnalysisProps {
  dataSource: DataSourceInfo;
}

const SnowflakeAnalysis: React.FC<SnowflakeAnalysisProps> = ({ dataSource }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizationScores, setOptimizationScores] = useState({
    storage: 78,
    performance: 65,
    costs: 82,
    security: 91
  });
  
  const snowflakeMetrics = [
    { name: "Warehouse Utilization", value: "64%", trend: "up", change: "+8%" },
    { name: "Query Performance", value: "342ms", trend: "down", change: "-12%" },
    { name: "Storage Compression", value: "3.8x", trend: "up", change: "+0.2x" },
    { name: "Credits Consumed (MTD)", value: "182.5", trend: "down", change: "-5%" }
  ];
  
  const optimizationRecommendations = [
    { 
      type: "performance", 
      title: "Create Clustered Table for SALES.TRANSACTIONS", 
      impact: "high",
      description: "Clustering the TRANSACTIONS table by TRANSACTION_DATE will improve query performance by 40% for date-range queries.",
      sql: "ALTER TABLE SALES.TRANSACTIONS CLUSTER BY (TRANSACTION_DATE)"
    },
    { 
      type: "storage", 
      title: "Enable Table Compression", 
      impact: "medium",
      description: "Enabling compression on large tables will reduce storage costs by approximately 30%.",
      sql: "ALTER TABLE SALES.TRANSACTIONS SET DATA_RETENTION_TIME_IN_DAYS = 90"
    },
    { 
      type: "costs", 
      title: "Implement Auto-suspend for Warehouse", 
      impact: "high",
      description: "Set auto-suspend to 5 minutes to avoid idle warehouse costs.",
      sql: "ALTER WAREHOUSE COMPUTE_WH SET AUTO_SUSPEND = 300"
    },
    { 
      type: "security", 
      title: "Implement Column-level Security", 
      impact: "medium",
      description: "Mask sensitive customer information for analytics roles.",
      sql: "ALTER TABLE SALES.CUSTOMERS MODIFY COLUMN EMAIL SET MASKING POLICY EMAIL_MASK"
    }
  ];
  
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    toast.info("Starting Snowflake optimization analysis...");
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          toast.success("Snowflake analysis complete! Optimization recommendations ready.");
          return 100;
        }
        
        return newProgress;
      });
    }, 500);
  };
  
  const applyRecommendation = (sql: string) => {
    toast.info("Applying optimization...", {
      description: sql,
      duration: 2000
    });
    
    setTimeout(() => {
      toast.success("Optimization applied successfully!");
      
      // Update scores to simulate improvement
      setOptimizationScores(prev => {
        const randomImprovement = Math.floor(Math.random() * 5) + 1;
        const key = sql.toLowerCase().includes('cluster') ? 'performance' : 
                    sql.toLowerCase().includes('compress') ? 'storage' :
                    sql.toLowerCase().includes('suspend') ? 'costs' : 'security';
                    
        return {
          ...prev,
          [key]: Math.min(prev[key as keyof typeof prev] + randomImprovement, 100)
        };
      });
    }, 2000);
  };
  
  const downloadReport = () => {
    toast.info("Generating Snowflake optimization report...");
    
    setTimeout(() => {
      toast.success("Report generated and downloaded!");
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Snowflake className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Snowflake Optimization</CardTitle>
              <CardDescription>
                AI-powered analysis and recommendations for your Snowflake data warehouse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!analysisComplete ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
                <div className="space-y-2 max-w-lg">
                  <h3 className="text-lg font-medium">Optimize Your Snowflake Environment</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze your Snowflake warehouse configuration, query patterns, 
                    storage usage, and security settings to provide tailored optimization recommendations.
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={runAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Snowflake className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run Optimization Analysis
                    </>
                  )}
                </Button>
              </div>
              
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analyzing Snowflake environment...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-xs text-muted-foreground italic">
                    Examining query patterns, warehouse configuration, storage usage, and security settings
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Performance Optimization</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Identify slow-running queries and optimize warehouse configuration.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Storage Efficiency</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze storage patterns and recommend data retention policies.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Cost Reduction</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Find opportunities to reduce Snowflake credit consumption.
                  </p>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Security & Governance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Evaluate access patterns and suggest security enhancements.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Storage</h4>
                        <Badge variant={optimizationScores.storage > 80 ? "default" : "outline"}>
                          {optimizationScores.storage}/100
                        </Badge>
                      </div>
                      <Progress value={optimizationScores.storage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Performance</h4>
                        <Badge variant={optimizationScores.performance > 80 ? "default" : "outline"}>
                          {optimizationScores.performance}/100
                        </Badge>
                      </div>
                      <Progress value={optimizationScores.performance} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Costs</h4>
                        <Badge variant={optimizationScores.costs > 80 ? "default" : "outline"}>
                          {optimizationScores.costs}/100
                        </Badge>
                      </div>
                      <Progress value={optimizationScores.costs} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Security</h4>
                        <Badge variant={optimizationScores.security > 80 ? "default" : "outline"}>
                          {optimizationScores.security}/100
                        </Badge>
                      </div>
                      <Progress value={optimizationScores.security} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Optimization Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {optimizationRecommendations.map((rec, index) => (
                        <div key={index} className="p-4 border-b last:border-b-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline"
                                  className={
                                    rec.type === 'performance' ? 'text-blue-500 border-blue-200 bg-blue-50' :
                                    rec.type === 'storage' ? 'text-amber-500 border-amber-200 bg-amber-50' :
                                    rec.type === 'costs' ? 'text-green-500 border-green-200 bg-green-50' :
                                    'text-purple-500 border-purple-200 bg-purple-50'
                                  }
                                >
                                  {rec.type}
                                </Badge>
                                <Badge variant={rec.impact === 'high' ? 'destructive' : 'secondary'}>
                                  {rec.impact} impact
                                </Badge>
                              </div>
                              <h4 className="font-medium">{rec.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {rec.description}
                              </p>
                              <div className="bg-muted p-2 rounded-md text-xs font-mono mt-2">
                                {rec.sql}
                              </div>
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="whitespace-nowrap"
                              onClick={() => applyRecommendation(rec.sql)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Warehouse Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {snowflakeMetrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{metric.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-semibold">{metric.value}</span>
                              <span className={`text-xs flex items-center ${
                                (metric.trend === 'up' && metric.name === 'Credits Consumed') || 
                                (metric.trend === 'down' && metric.name === 'Query Performance') 
                                  ? 'text-red-500' : 
                                (metric.trend === 'down' && metric.name === 'Credits Consumed') || 
                                (metric.trend === 'up' && metric.name === 'Query Performance')
                                  ? 'text-green-500' : 'text-blue-500'
                              }`}>
                                {metric.trend === 'up' ? 
                                  <TrendingUp className="h-3 w-3 mr-1" /> : 
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                }
                                {metric.change}
                              </span>
                            </div>
                          </div>
                          
                          {metric.name === 'Warehouse Utilization' ? (
                            <PieChart className="h-10 w-10 text-blue-500" />
                          ) : metric.name === 'Query Performance' ? (
                            <LineChart className="h-10 w-10 text-green-500" />
                          ) : metric.name === 'Storage Compression' ? (
                            <Database className="h-10 w-10 text-amber-500" />
                          ) : (
                            <BarChart className="h-10 w-10 text-purple-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2" onClick={downloadReport}>
                      <Download className="h-4 w-4" />
                      Download Full Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SnowflakeAnalysis;
