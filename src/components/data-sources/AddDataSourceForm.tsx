
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConnectionCredentials, DataService, DataSource, DataSourceStatus } from '@/services/dataService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddDataSourceFormProps {
  onSuccess?: (dataSourceId: string) => void;
  onCancel?: () => void;
}

const AddDataSourceForm: React.FC<AddDataSourceFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DataSource>('postgresql');
  const [isTesting, setIsTesting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [credentials, setCredentials] = useState<ConnectionCredentials>({
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    useSSL: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setType(value as DataSource);
    
    // Set default port based on database type
    let defaultPort = '';
    switch (value) {
      case 'postgresql':
        defaultPort = '5432';
        break;
      case 'mysql':
        defaultPort = '3306';
        break;
      case 'mongodb':
        defaultPort = '27017';
        break;
      case 'oracle':
        defaultPort = '1521';
        break;
      case 'sqlserver':
        defaultPort = '1433';
        break;
    }
    
    setCredentials(prev => ({ ...prev, port: defaultPort }));
  };

  const testConnection = async () => {
    if (!credentials.host || !credentials.port || !credentials.username || !credentials.password || !credentials.database) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsTesting(true);
    try {
      const result = await DataService.testDatabaseConnection(credentials, type);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Connection test error:", error);
      toast.error("Failed to test connection");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a name for the data source");
      return;
    }
    
    if (!credentials.host || !credentials.port || !credentials.username || !credentials.password || !credentials.database) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsAdding(true);
    try {
      const newDataSource = await DataService.addDataSource({
        name,
        type,
        status: 'connected' as DataSourceStatus, // Add the missing status property
        connectionDetails: credentials
      });
      
      toast.success(`Data source "${name}" added successfully`);
      
      if (onSuccess) {
        onSuccess(newDataSource.id);
      }
    } catch (error) {
      console.error("Error adding data source:", error);
      toast.error("Failed to add data source");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Add New Data Source</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Data Source Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Production Database"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Database Type</Label>
            <Select 
              value={type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
                <SelectItem value="sqlserver">SQL Server</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="api">API Endpoint</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type !== 'csv' && type !== 'api' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input 
                    id="host" 
                    name="host"
                    value={credentials.host} 
                    onChange={handleInputChange} 
                    placeholder="localhost or db.example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port" 
                    name="port"
                    value={credentials.port} 
                    onChange={handleInputChange} 
                    placeholder={type === 'postgresql' ? '5432' : type === 'mysql' ? '3306' : '27017'}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username"
                    value={credentials.username} 
                    onChange={handleInputChange} 
                    placeholder="admin"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    value={credentials.password} 
                    onChange={handleInputChange} 
                    type="password"
                    placeholder="•••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database">Database Name</Label>
                <Input 
                  id="database" 
                  name="database"
                  value={credentials.database} 
                  onChange={handleInputChange} 
                  placeholder="mydatabase"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="useSSL" 
                  checked={credentials.useSSL} 
                  onCheckedChange={(checked) => setCredentials(prev => ({ ...prev, useSSL: checked }))}
                />
                <Label htmlFor="useSSL">Use SSL/TLS connection</Label>
              </div>
            </>
          )}
          
          {type === 'csv' && (
            <div className="space-y-4">
              <div className="p-4 border border-dashed rounded-md flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground mb-2">Upload CSV File</p>
                <Input type="file" accept=".csv" className="max-w-xs" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="csv-name">File Description</Label>
                <Input 
                  id="csv-name" 
                  placeholder="Customer Data - June 2023"
                />
              </div>
            </div>
          )}
          
          {type === 'api' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Endpoint URL</Label>
                <Input 
                  id="api-url" 
                  placeholder="https://api.example.com/data"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (optional)</Label>
                <Input 
                  id="api-key" 
                  type="password"
                  placeholder="•••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-format">Response Format</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <div className="flex space-x-2">
            {type !== 'csv' && type !== 'api' && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={testConnection}
                disabled={isTesting || !credentials.host || !credentials.port || !credentials.username || !credentials.password || !credentials.database}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isAdding || (type !== 'csv' && type !== 'api' && (!credentials.host || !credentials.port || !credentials.username || !credentials.password || !credentials.database))}
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Data Source'
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddDataSourceForm;
