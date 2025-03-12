
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string;
  description?: string;
  change?: number;
  delta?: number; // Added for compatibility
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  type?: string;
  data?: any;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  description,
  change,
  delta, // Added for compatibility
  icon,
  loading = false,
  className,
  type,
  data
}) => {
  // Use delta if change is not provided
  const changeValue = change !== undefined ? change : delta;
  const isPositive = changeValue && changeValue > 0;
  const isNegative = changeValue && changeValue < 0;
  
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 h-full glass-card", 
                        loading && "animate-pulse",
                        className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(description || changeValue !== undefined) && (
          <div className="flex items-center gap-1 mt-1">
            {changeValue !== undefined && (
              <div className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-green-500" : "",
                isNegative ? "text-red-500" : ""
              )}>
                {isPositive && <ArrowUp className="h-3 w-3" />}
                {isNegative && <ArrowDown className="h-3 w-3" />}
                <span>{Math.abs(changeValue)}%</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Render chart data if available and needed in the future */}
        {data && type && (
          <div className="mt-4">
            {/* Chart rendering logic can be added here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
