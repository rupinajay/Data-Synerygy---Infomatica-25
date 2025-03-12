
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedResult } from '@/services/informaticaService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  ExternalLink,
  Lightbulb,
  Code,
  MessageSquare,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface EnhancedQueryResultProps {
  result: ProcessedResult | null;
  className?: string;
}

const EnhancedQueryResult: React.FC<EnhancedQueryResultProps> = ({ result, className }) => {
  const [activeTab, setActiveTab] = useState<"natural" | "raw" | "visual">("natural");
  
  if (!result) return null;

  // Format JSON with syntax highlighting
  const formatJson = () => {
    try {
      return JSON.stringify(result.rawJson, null, 2);
    } catch (error) {
      return "Error formatting JSON";
    }
  };

  // Handle markdown formatting for natural language response
  const formatNaturalLanguage = (text: string) => {
    if (text.includes('**')) {
      // This is likely a markdown response
      return (
        <div className="space-y-2">
          {text.split('\n').filter(line => line.trim()).map((line, index) => (
            <div key={index} className="markdown-line">
              {line.includes('**') ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: line
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\\\\/g, '\\')
                }} />
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return <div className="text-base whitespace-pre-line">{text}</div>;
  };

  // Extract key metrics and insights from the raw JSON for display
  const renderKeyMetrics = () => {
    const data = result.rawJson;
    if (!data || typeof data !== 'object') return null;
    
    const metrics: Array<{label: string, value: string | number}> = [];
    
    // Handle different potential data structures
    if (data.Performance_Metrics) {
      Object.entries(data.Performance_Metrics).forEach(([key, value]) => {
        metrics.push({
          label: key.replace(/_/g, ' '),
          value: value as string | number
        });
      });
    }
    
    if (data.Account_Details) {
      // Pick a few key metrics from account details
      const keysToShow = ['Revenue', 'Industry_Type', 'Upsell_Status'];
      Object.entries(data.Account_Details)
        .filter(([key]) => keysToShow.includes(key))
        .forEach(([key, value]) => {
          metrics.push({
            label: key.replace(/_/g, ' '),
            value: value as string | number
          });
        });
    }
    
    // Add any top-level metrics that look like metrics
    Object.entries(data)
      .filter(([key, value]) => 
        !['Account_Details', 'Performance_Metrics', 'Growth_Opportunities', 'Final_Answer'].includes(key) && 
        typeof value !== 'object'
      )
      .forEach(([key, value]) => {
        metrics.push({
          label: key.replace(/_/g, ' '),
          value: value as string | number
        });
      });
    
    if (metrics.length === 0) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-[#2a2a2c] rounded-md p-3 flex flex-col">
            <span className="text-xs text-gray-400">{metric.label}</span>
            <span className="text-base font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Extract opportunities or recommendations
  const renderOpportunities = () => {
    const data = result.rawJson;
    if (!data || !data.Growth_Opportunities || !Array.isArray(data.Growth_Opportunities)) {
      return null;
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          Growth Opportunities
        </h3>
        <ul className="space-y-2">
          {data.Growth_Opportunities.map((opportunity: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                {index + 1}
              </span>
              <span>{opportunity}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Card className={cn("w-full overflow-hidden transition-all bg-[#1c1c1e] border-[#3c3c3e] shadow-xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          Query Results
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "natural" | "raw" | "visual")}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Natural Language</span>
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Data Summary</span>
          </TabsTrigger>
          <TabsTrigger value="raw" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Raw JSON</span>
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-4">
          <TabsContent value="natural" className="mt-0">
            {result.error ? (
              <div className="bg-red-900/20 p-4 rounded-md border border-red-900/30 text-red-300">
                <p className="font-semibold mb-1">Error</p>
                <p>{result.error}</p>
              </div>
            ) : (
              formatNaturalLanguage(result.naturalLanguage)
            )}
          </TabsContent>
          
          <TabsContent value="visual" className="mt-0">
            {renderKeyMetrics()}
            {renderOpportunities()}
            {!renderKeyMetrics() && !renderOpportunities() && (
              <div className="text-center py-8 text-gray-400">
                <BarChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No structured data available for visualization</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="raw" className="mt-0">
            <div className="bg-[#2a2a2c] rounded-md p-4 overflow-x-auto max-h-[50vh] text-xs font-mono">
              <pre>{formatJson()}</pre>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <Separator className="bg-[#3c3c3e]" />
      
      <CardFooter className="flex justify-between py-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedQueryResult;
