import { toast } from "sonner";

// Data source types
export type DataSource = 'mysql' | 'postgresql' | 'mongodb' | 'oracle' | 'sqlserver' | 'sqlite' | 'csv' | 'api' | 'snowflake';
export type DataSourceStatus = 'connected' | 'syncing' | 'error' | 'maintenance' | 'disconnected';

// Connection Credentials interface
export interface ConnectionCredentials {
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  apiKey?: string;
  useSSL?: boolean;
  timeout?: number;
}

// Data source information
export interface DataSourceInfo {
  id: string;
  name: string;
  type: DataSource;
  status: DataSourceStatus;
  connectionDetails?: ConnectionCredentials;
  lastSync?: string;
  recordCount?: number;
  qualityScore?: number;
  message?: string;
  schemas?: SchemaInfo[];
  icon?: string;
}

// Database schema information
export interface SchemaInfo {
  name: string;
  tables: TableInfo[];
}

// Table information
export interface TableInfo {
  name: string;
  rowCount: number;
  columns: ColumnInfo[];
}

// Column information
export interface ColumnInfo {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeign: boolean;
  isNullable: boolean;
}

// Insight Data interface
export interface InsightData {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  sources: { name: string; confidence: number; }[];
}

// Dashboard Data interface
export interface DashboardData {
  insights: InsightData[];
  dataSources: DataSourceInfo[];
  metrics: {
    [key: string]: number | string;
  };
  kpis: {
    [key: string]: {
      value: number;
      change: number;
      status: 'up' | 'down' | 'neutral';
    };
  };
}

// Query result
export interface QueryResult {
  answer: string;
  sources: { name: string; confidence: number; }[];
  insights: string[];
  metrics: any;
  recommendations: string[];
}

// Direct query result
export interface DirectQueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  queryTime: number;
}

// Add missing interface for schema export
export interface SchemaExportResult {
  success: boolean;
  data: any;
  message?: string;
}

// Add missing interface for optimized query result
export interface OptimizedQueryResult {
  success: boolean;
  optimizedQuery: string;
  improvementNotes?: string;
}

// Mock data sources
const dataSources: DataSourceInfo[] = [
  {
    id: '1',
    name: 'MySQL Database',
    type: 'mysql',
    status: 'connected',
    connectionDetails: {
      host: 'localhost',
      port: '3306',
      database: 'mydatabase',
      username: 'user'
    },
    lastSync: '2024-01-22T10:00:00Z',
    recordCount: 1500000,
    qualityScore: 78,
    icon: 'Database',
    schemas: [
      {
        name: 'default',
        tables: [
          {
            name: 'users',
            rowCount: 50000,
            columns: [
              { name: 'id', type: 'int', isPrimary: true, isForeign: false, isNullable: false },
              { name: 'name', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'email', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'created_at', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: true }
            ]
          },
          {
            name: 'orders',
            rowCount: 100000,
            columns: [
              { name: 'id', type: 'int', isPrimary: true, isForeign: false, isNullable: false },
              { name: 'user_id', type: 'int', isPrimary: false, isForeign: true, isNullable: false },
              { name: 'product_id', type: 'int', isPrimary: false, isForeign: true, isNullable: false },
              { name: 'order_date', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'total_amount', type: 'decimal', isPrimary: false, isForeign: false, isNullable: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'PostgreSQL Warehouse',
    type: 'postgresql',
    status: 'syncing',
    connectionDetails: {
      host: 'localhost',
      port: '5432',
      database: 'warehouse',
      username: 'admin'
    },
    lastSync: '2024-01-23T08:30:00Z',
    recordCount: 5000000,
    qualityScore: 92,
    icon: 'Database',
    schemas: [
      {
        name: 'public',
        tables: [
          {
            name: 'customers',
            rowCount: 200000,
            columns: [
              { name: 'customer_id', type: 'int', isPrimary: true, isForeign: false, isNullable: false },
              { name: 'first_name', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'last_name', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'email', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'signup_date', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: false }
            ]
          },
          {
            name: 'products',
            rowCount: 50000,
            columns: [
              { name: 'product_id', type: 'int', isPrimary: true, isForeign: false, isNullable: false },
              { name: 'product_name', type: 'varchar', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'description', type: 'text', isPrimary: false, isForeign: false, isNullable: true },
              { name: 'price', type: 'decimal', isPrimary: false, isForeign: false, isNullable: false }
            ]
          },
          {
            name: 'sales',
            rowCount: 1000000,
            columns: [
              { name: 'sale_id', type: 'int', isPrimary: true, isForeign: false, isNullable: false },
              { name: 'customer_id', type: 'int', isPrimary: false, isForeign: true, isNullable: false },
              { name: 'product_id', type: 'int', isPrimary: false, isForeign: true, isNullable: false },
              { name: 'sale_date', type: 'timestamp', isPrimary: false, isForeign: false, isNullable: false },
              { name: 'quantity', type: 'int', isPrimary: false, isForeign: false, isNullable: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'MongoDB Analytics',
    type: 'mongodb',
    status: 'error',
    connectionDetails: {
      host: 'localhost',
      port: '27017',
      database: 'analytics',
      username: 'analyst'
    },
    message: 'Connection refused',
    lastSync: '2024-01-20T15:45:00Z',
    recordCount: 8000000,
    qualityScore: 65,
    icon: 'Database'
  },
  {
    id: '4',
    name: 'CSV Sales Data',
    type: 'csv',
    status: 'connected',
    recordCount: 25000,
    qualityScore: 88,
    icon: 'FileText'
  },
  {
    id: '5',
    name: 'REST API - Marketing',
    type: 'api',
    status: 'maintenance',
    message: 'Under maintenance',
    recordCount: 10000,
    qualityScore: 70,
    icon: 'TrendingUp'
  }
];

// Mock insights data
const insightsData: InsightData[] = [
  {
    id: '1',
    title: 'Revenue Growth Trend',
    content: 'Revenue has shown a consistent growth of 15% month-over-month for the past quarter, significantly outperforming industry standards.',
    category: 'Sales',
    date: '2024-01-15T09:15:00Z',
    sources: [
      { name: 'Financial Database', confidence: 95 },
      { name: 'Market Analysis', confidence: 85 }
    ]
  },
  {
    id: '2',
    title: 'Customer Retention Improvement',
    content: 'Customer retention rate increased from 65% to 78% after the implementation of the new loyalty program.',
    category: 'Customer',
    date: '2024-01-12T14:30:00Z',
    sources: [
      { name: 'CRM Data', confidence: 92 },
      { name: 'Customer Surveys', confidence: 75 }
    ]
  },
  {
    id: '3',
    title: 'Product Feature Adoption',
    content: 'The new collaboration feature has a 45% adoption rate, with users spending an average of 25 minutes using it daily.',
    category: 'Product',
    date: '2024-01-10T11:45:00Z',
    sources: [
      { name: 'Usage Analytics', confidence: 97 },
      { name: 'User Feedback', confidence: 80 }
    ]
  },
  {
    id: '4',
    title: 'Marketing Campaign Effectiveness',
    content: 'The Q4 email campaign achieved a 28% open rate and 12% conversion rate, generating $450,000 in attributable revenue.',
    category: 'Marketing',
    date: '2024-01-08T16:20:00Z',
    sources: [
      { name: 'Marketing Analytics', confidence: 93 },
      { name: 'Sales Data', confidence: 88 }
    ]
  },
  {
    id: '5',
    title: 'Support Ticket Resolution Time',
    content: 'Average support ticket resolution time decreased by 35% after implementing the new knowledge base and chatbot integration.',
    category: 'Customer Success',
    date: '2024-01-05T13:10:00Z',
    sources: [
      { name: 'Support Desk', confidence: 96 },
      { name: 'Customer Feedback', confidence: 82 }
    ]
  }
];

// Mock dashboard data
const dashboardData: DashboardData = {
  insights: insightsData.slice(0, 3),
  dataSources: dataSources,
  metrics: {
    'Total Records': '15.5M',
    'Active Sources': '4/5',
    'Avg. Quality Score': '78%',
    'Last Sync': '15 minutes ago'
  },
  kpis: {
    'Revenue': {
      value: 1250000,
      change: 15.8,
      status: 'up'
    },
    'Users': {
      value: 28750,
      change: 8.5,
      status: 'up'
    },
    'Conversion': {
      value: 3.2,
      change: -0.5,
      status: 'down'
    },
    'Churn': {
      value: 2.1,
      change: -1.2,
      status: 'up'
    }
  }
};

const sampleQueries: { [key: string]: string[] } = {
  mysql: [
    "SELECT * FROM users LIMIT 10;",
    "SELECT COUNT(*) FROM orders;",
    "SELECT product_id, SUM(total_amount) FROM orders GROUP BY product_id;"
  ],
  postgresql: [
    "SELECT * FROM customers LIMIT 10;",
    "SELECT COUNT(*) FROM sales;",
    "SELECT product_id, AVG(price) FROM products GROUP BY product_id;"
  ],
  mongodb: [
    "db.customers.find().limit(10)",
    "db.sales.countDocuments()",
    "db.products.aggregate([{$group: {_id: '$product_id', avgPrice: {$avg: '$price'}}}])"
  ],
  oracle: [],
  sqlserver: [],
  sqlite: [],
  csv: [],
  api: [],
  snowflake: []
};

export const DataService = {
  // Get all data sources
  getDataSources: async (): Promise<DataSourceInfo[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dataSources);
      }, 500);
    });
  },

  // Get a data source by ID
  getDataSourceById: async (id: string): Promise<DataSourceInfo | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const dataSource = dataSources.find(ds => ds.id === id);
        resolve(dataSource);
      }, 300);
    });
  },

  // Get database schemas for a data source
  getDatabaseSchemas: async (dataSourceId: string): Promise<SchemaInfo[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const dataSource = dataSources.find(ds => ds.id === dataSourceId);
        if (dataSource && dataSource.schemas) {
          resolve(dataSource.schemas);
        } else {
          resolve([]);
        }
      }, 600);
    });
  },

  // Process a query (mock implementation)
  processQuery: async (query: string): Promise<QueryResult> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          answer: `Mock answer for query: ${query}`,
          sources: [{ name: 'Mock Data', confidence: 80 }],
          insights: ['This is a mock insight.'],
          metrics: { mockMetric: 123 },
          recommendations: ['Consider optimizing your query.']
        });
      }, 1000);
    });
  },

  // Execute a direct query (mock implementation)
  executeQuery: async (dataSourceId: string, query: string): Promise<DirectQueryResult> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate a result set
        const columns = ['id', 'name', 'value'];
        const rows = [
          [1, 'A', 100],
          [2, 'B', 200],
          [3, 'C', 300]
        ];
        
        resolve({
          columns: columns,
          rows: rows,
          rowCount: rows.length,
          queryTime: 0.123
        });
      }, 750);
    });
  },
  
  // Get sample queries for a data source type
  getSampleQueries: async (dataSourceType: DataSource): Promise<string[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(sampleQueries[dataSourceType] || []);
      }, 400);
    });
  },

  // Export database schema
  exportDatabaseSchema: async (dataSourceId: string): Promise<SchemaExportResult> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const dataSource = dataSources.find(ds => ds.id === dataSourceId);
        if (dataSource && dataSource.schemas) {
          resolve({
            success: true,
            data: dataSource.schemas,
            message: "Schema exported successfully"
          });
        } else {
          resolve({
            success: true,
            data: [{
              name: "default",
              tables: [
                {
                  name: "sample_table",
                  rowCount: 1000,
                  columns: [
                    { name: "id", type: "int", isPrimary: true, isForeign: false, isNullable: false },
                    { name: "name", type: "varchar", isPrimary: false, isForeign: false, isNullable: false },
                    { name: "created_at", type: "timestamp", isPrimary: false, isForeign: false, isNullable: true }
                  ]
                }
              ]
            }],
            message: "Default schema exported"
          });
        }
      }, 800);
    });
  },

  // Analyze data quality
  analyzeDataQuality: async (dataSourceId: string): Promise<any> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const dataSource = dataSources.find(ds => ds.id === dataSourceId);
        if (dataSource) {
          resolve({
            qualityScore: dataSource.qualityScore || 85,
            summary: "Overall data quality is good with some minor issues detected.",
            issues: [
              {
                severity: "medium",
                issue: "Missing values in non-nullable fields",
                recommendation: "Implement data validation to ensure required fields have values."
              },
              {
                severity: "low",
                issue: "Inconsistent date formats",
                recommendation: "Standardize date formats across all tables."
              },
              {
                severity: "high",
                issue: "Duplicate entries detected",
                recommendation: "Implement uniqueness constraints and clean up existing duplicates."
              }
            ]
          });
        } else {
          resolve({
            qualityScore: 0,
            summary: "Unable to analyze data quality.",
            issues: []
          });
        }
      }, 1500);
    });
  },

  // Generate optimized query
  generateOptimizedQuery: async (query: string, dataSourceId: string): Promise<OptimizedQueryResult> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Simple optimization simulation
        let optimizedQuery = query;
        
        // Replace SELECT * with specific columns
        if (query.toLowerCase().includes("select *")) {
          optimizedQuery = query.replace(/SELECT \*/i, "SELECT id, name, created_at");
        }
        
        // Add LIMIT if missing
        if (!query.toLowerCase().includes("limit")) {
          optimizedQuery = optimizedQuery + " LIMIT 1000";
        }
        
        resolve({
          success: true,
          optimizedQuery,
          improvementNotes: "Added column specification and row limit for better performance."
        });
      }, 1000);
    });
  },

  // Get insights data
  getInsights: async (): Promise<InsightData[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(insightsData);
      }, 700);
    });
  },

  // Get dashboard data
  getDashboardData: async (): Promise<DashboardData> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(dashboardData);
      }, 800);
    });
  },

  // Refresh data sources
  refreshDataSources: async (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        toast.success("Data sources refreshed");
        resolve();
      }, 1500);
    });
  },

  // Test database connection
  testDatabaseConnection: async (credentials: ConnectionCredentials, type: DataSource): Promise<{success: boolean, message: string}> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simple validation for host and port
        if (!credentials.host && !credentials.connectionString) {
          resolve({
            success: false,
            message: "Host or connection string is required"
          });
          return;
        }

        // 80% success rate for testing
        const success = Math.random() > 0.2;
        
        if (success) {
          resolve({
            success: true,
            message: "Connection successful"
          });
        } else {
          resolve({
            success: false,
            message: "Failed to connect: Authentication failed"
          });
        }
      }, 1200);
    });
  },

  // Add new data source
  addDataSource: async (dataSource: Omit<DataSourceInfo, 'id'>): Promise<DataSourceInfo> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newId = (dataSources.length + 1).toString();
        const newDataSource: DataSourceInfo = {
          id: newId,
          ...dataSource,
          lastSync: new Date().toISOString(),
          recordCount: 0,
          qualityScore: 100
        };
        
        dataSources.push(newDataSource);
        toast.success("Data source added successfully");
        resolve(newDataSource);
      }, 1000);
    });
  },
};
