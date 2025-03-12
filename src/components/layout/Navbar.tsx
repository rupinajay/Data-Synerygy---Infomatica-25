
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation sections based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case '/insights':
        return 'AI Insights';
      case '/data-sources':
        return 'Data Sources';
      case '/reports':
        return 'Reports';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'AI Insights';
    }
  };

  return (
    <header className="w-full h-16 border-b border-border bg-background/50 backdrop-blur-lg z-10 px-4 sticky top-0">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search..." 
              className="pl-8 rounded-full bg-secondary border-none h-9"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/settings')}
                  className={location.pathname === '/settings' ? 'bg-secondary' : ''}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
