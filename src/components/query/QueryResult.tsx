
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QueryResult } from '@/services/dataService';
import { BarChart2, ThumbsUp, ThumbsDown, Share2, Download, ExternalLink, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface QueryResultCardProps {
  result: QueryResult | null;
  className?: string;
}

const QueryResultCard: React.FC<QueryResultCardProps> = ({ result, className }) => {
  if (!result) return null;

  // Handle markdown formatting for Informatica responses
  const formatAnswer = (answer: string) => {
    if (answer.includes('**')) {
      // This is likely a markdown response from Informatica
      return (
        <div className="space-y-2">
          {answer.split('\n').filter(line => line.trim()).map((line, index) => (
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
    
    return <div className="text-base">{answer}</div>;
  };

  // Safely render metrics objects
  const renderMetrics = () => {
    if (!result.metrics || typeof result.metrics !== 'object') return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(result.metrics).map(([key, value], index) => (
          <div key={index} className="bg-[#2c2c2e] rounded-md p-2">
            <div className="text-xs text-muted-foreground">{key}</div>
            <div className="text-sm font-semibold">{String(value)}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("w-full overflow-hidden transition-all bg-[#1c1c1e] border-[#3c3c3e] shadow-xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Response
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {formatAnswer(result.answer)}
        
        {/* Sources */}
        <div className="pt-2">
          <div className="flex items-center gap-1 mb-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Data sources</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {result.sources.map((source, index) => (
              <div key={index} className={cn(
                "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                source.confidence >= 90 ? "bg-green-900/50 text-green-300" :
                source.confidence >= 70 ? "bg-blue-900/50 text-blue-300" :
                source.confidence >= 50 ? "bg-amber-900/50 text-amber-300" :
                "bg-red-900/50 text-red-300"
              )}>
                <span>{source.name}</span>
                <span className="font-medium">{source.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Key Metrics - Only show if they exist */}
        {result.metrics && Object.keys(result.metrics).length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-1 mb-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Key Information</span>
            </div>
            
            {renderMetrics()}
          </div>
        )}
        
        {/* Recommendations - Only show if they exist */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-1 mb-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Recommended Actions</span>
            </div>
            
            <div className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="text-sm">{recommendation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
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

export default QueryResultCard;
