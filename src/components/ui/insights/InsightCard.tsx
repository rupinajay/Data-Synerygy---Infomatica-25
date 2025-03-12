
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, Download, ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface InsightSourceProps {
  name: string;
  confidence: number;
}

interface InsightCardProps {
  title: string;
  content: string;
  sources: InsightSourceProps[];
  date: string;
  category: string;
  actions?: React.ReactNode[];
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  content,
  sources,
  date,
  category,
  actions
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 h-full bg-[#1c1c1e] border-[#3c3c3e] hover:shadow-lg animate-scale-in">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{content}</p>
        
        <div className="pt-2">
          <div className="flex items-center gap-1 mb-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">Data sources</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                      source.confidence >= 90 ? "bg-green-900/50 text-green-300" :
                      source.confidence >= 70 ? "bg-blue-900/50 text-blue-300" :
                      source.confidence >= 50 ? "bg-amber-900/50 text-amber-300" :
                      "bg-red-900/50 text-red-300"
                    )}>
                      <span>{source.name}</span>
                      <span className="font-medium">{source.confidence}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence score: {source.confidence}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" className="gap-1 text-xs text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
          <Info className="h-3.5 w-3.5" />
          <span>Explanation</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2c2c2e]">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InsightCard;
