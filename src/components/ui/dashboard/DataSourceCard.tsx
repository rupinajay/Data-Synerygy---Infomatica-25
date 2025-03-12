
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertTriangle, Database, FileText, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataSource, DataSourceStatus } from '@/services/dataService';

interface DataSourceCardProps {
  name: string;
  status: DataSourceStatus;
  icon?: React.ReactNode | string;
  type?: DataSource | string;
  lastSync?: string;
  lastUpdated?: string;
  recordCount?: number;
  qualityScore?: number;
  className?: string;
  onClick?: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({
  name,
  status,
  icon,
  type,
  lastSync,
  lastUpdated,
  recordCount,
  qualityScore = 0,
  className,
  onClick
}) => {
  const statusDisplay = {
    connected: { label: 'Connected', icon: <Check className="h-4 w-4" />, color: 'text-green-500' },
    syncing: { label: 'Syncing', icon: <Clock className="h-4 w-4" />, color: 'text-amber-500' },
    error: { label: 'Error', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' },
    maintenance: { label: 'Maintenance', icon: <Clock className="h-4 w-4" />, color: 'text-blue-500' },
    disconnected: { label: 'Disconnected', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-500' }
  };

  const getIconForType = () => {
    // If icon is already a React node, return it directly
    if (React.isValidElement(icon)) return icon;
    
    // If icon is a string, we'll try to use it as a name reference
    if (typeof icon === 'string') {
      switch(icon) {
        case 'Database': return <Database className="h-5 w-5" />;
        case 'Users': return <Users className="h-5 w-5" />;
        case 'FileText': return <FileText className="h-5 w-5" />;
        case 'TrendingUp': return <TrendingUp className="h-5 w-5" />;
        default: return <Database className="h-5 w-5" />;
      }
    }
    
    // If no icon provided, determine based on type
    switch(type) {
      case 'mysql': 
      case 'postgresql': 
      case 'mongodb': 
      case 'oracle': 
      case 'sqlserver': 
      case 'sqlite': 
      case 'snowflake': 
        return <Database className="h-5 w-5" />;
      case 'csv': return <FileText className="h-5 w-5" />;
      case 'api': return <TrendingUp className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  const currentStatus = statusDisplay[status];
  const lastUpdatedTime = lastUpdated || lastSync;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full glass-card hover:shadow-md", 
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {getIconForType()}
          </div>
          <CardTitle className="text-base font-medium">{name}</CardTitle>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium pill-badge px-2 py-1", 
                         `bg-${status === 'connected' ? 'green' : status === 'syncing' ? 'amber' : 'red'}-100`,
                         currentStatus.color)}>
          {currentStatus.icon}
          <span>{currentStatus.label}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {type && (
            <div className="text-xs">
              <span className="text-muted-foreground">Type: </span>
              <span className="font-medium capitalize">{type}</span>
            </div>
          )}
          
          {lastUpdatedTime && (
            <div className="text-xs">
              <span className="text-muted-foreground">Last sync: </span>
              <span className="font-medium">{lastUpdatedTime}</span>
            </div>
          )}
          
          {recordCount !== undefined && (
            <div className="text-xs">
              <span className="text-muted-foreground">Records: </span>
              <span className="font-medium">{recordCount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Data Quality</span>
              <span className="font-medium">{qualityScore}%</span>
            </div>
            <Progress value={qualityScore} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
