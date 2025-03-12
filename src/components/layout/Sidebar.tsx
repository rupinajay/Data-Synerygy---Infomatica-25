
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Database, 
  LineChart, 
  Settings, 
  Zap 
} from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
  const location = useLocation();

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "nav-link group",
              isActive && "active"
            )}
          >
            <Icon className="icon" />
            <span>{item.title}</span>
            
            {isActive && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const Sidebar = () => {
  const sidebarNavItems = [
    {
      title: "AI Insights",
      href: "/insights",
      icon: Zap,
    },
    {
      title: "Data Sources",
      href: "/data-sources",
      icon: Database,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: LineChart,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-border h-screen sticky top-0 bg-background z-10">
      <div className="h-16 border-b border-border flex items-center gap-2 px-4">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <h1 className="font-semibold text-lg tracking-tight">DataSynergy</h1>
      </div>
      
      <div className="py-4 px-2">
        <SidebarNav items={sidebarNavItems} />
      </div>
    </aside>
  );
};

export default Sidebar;
