
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SystemStatusType = 'operational' | 'maintenance' | 'degraded' | 'outage' | 'positive' | 'negative' | 'neutral';

interface SystemStatusProps {
  name?: string;
  title?: string;
  value?: string;
  delta?: number;
  status: SystemStatusType;
  lastUpdated?: string;
  description?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StatusCard: React.FC<SystemStatusProps> = ({
  name,
  title,
  value,
  delta,
  status,
  lastUpdated,
  description,
  message,
  icon,
  className,
  onClick
}) => {
  const statusConfig = {
    operational: { 
      icon: <CheckCircle className="h-4 w-4" />, 
      label: 'Operational',
      color: 'bg-green-100 text-green-700'
    },
    maintenance: { 
      icon: <Clock className="h-4 w-4" />, 
      label: 'Maintenance',
      color: 'bg-blue-100 text-blue-700'
    },
    degraded: { 
      icon: <AlertCircle className="h-4 w-4" />, 
      label: 'Degraded',
      color: 'bg-amber-100 text-amber-700'
    },
    outage: { 
      icon: <AlertCircle className="h-4 w-4" />, 
      label: 'Outage',
      color: 'bg-red-100 text-red-700'
    },
    positive: { 
      icon: <CheckCircle className="h-4 w-4" />, 
      label: 'Positive',
      color: 'bg-green-100 text-green-700'
    },
    negative: { 
      icon: <AlertCircle className="h-4 w-4" />, 
      label: 'Negative',
      color: 'bg-red-100 text-red-700'
    },
    neutral: { 
      icon: <Clock className="h-4 w-4" />, 
      label: 'Neutral',
      color: 'bg-blue-100 text-blue-700'
    }
  };

  const currentStatus = statusConfig[status];
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 h-full glass-card",
      status === 'operational' || status === 'positive' ? 'border-l-2 border-l-green-500' : 
      status === 'maintenance' || status === 'neutral' ? 'border-l-2 border-l-blue-500' :
      status === 'degraded' ? 'border-l-2 border-l-amber-500' :
      'border-l-2 border-l-red-500',
      className,
      onClick && "cursor-pointer"
    )}
    onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title || name}</CardTitle>
        <div className="flex items-center gap-2">
          {icon && <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>}
          <Badge variant="outline" className={cn("flex items-center gap-1", currentStatus.color)}>
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {value && (
          <div className="text-2xl font-bold">{value}</div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {message && (
          <p className="text-xs text-muted-foreground">{message}</p>
        )}
        
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        )}

        {delta !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            delta > 0 ? "text-green-500" : 
            delta < 0 ? "text-red-500" : 
            "text-blue-500"
          )}>
            {delta > 0 && <ArrowUp className="h-3 w-3 mr-1" />}
            {delta < 0 && <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(delta)}% from previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
