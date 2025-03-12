
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  UserCircle, 
  Bell, 
  Lock, 
  Database, 
  Palette, 
  Globe, 
  ExternalLink,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      // Mock user data
      return {
        name: "Alex Morgan",
        email: "alex.morgan@example.com",
        role: "Administrator",
        avatar: "/placeholder.svg",
        notifications: {
          email: true,
          push: true,
          updates: false,
          marketing: false,
        },
        appearance: {
          theme: "dark",
          compact: true,
          animations: true,
        },
        connections: [
          { name: "Snowflake", status: "connected", lastSync: "2 hours ago" },
          { name: "Salesforce", status: "connected", lastSync: "1 day ago" },
          { name: "Google Analytics", status: "error", lastSync: "3 days ago" },
          { name: "AWS S3", status: "connected", lastSync: "6 hours ago" },
          { name: "Stripe", status: "pending", lastSync: "Never" },
        ],
      };
    },
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-gradient">Settings</h1>
          <Button onClick={handleSave} disabled={isSaving} className="glass-button">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="glass-card p-6 md:col-span-1 h-fit">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden border-2 border-primary/30">
                {userData?.avatar ? (
                  <img src={userData.avatar} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-16 h-16 text-primary/50" />
                )}
              </div>
              <h2 className="text-lg font-medium">{userData?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{userData?.role || "User"}</p>
            </div>

            <nav className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={activeTab === "notifications" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "security" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("security")}
              >
                <Lock className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button
                variant={activeTab === "connections" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("connections")}
              >
                <Database className="h-4 w-4 mr-2" />
                Connections
              </Button>
              <Button
                variant={activeTab === "appearance" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </Button>
            </nav>
          </Card>

          <div className="md:col-span-3">
            {activeTab === "profile" && (
              <Card className="glass-card p-8">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <UserCircle className="h-5 w-5 mr-2 text-primary/80" />
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData?.name} className="glass-input" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={userData?.email} className="glass-input" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue={userData?.role} className="glass-input" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="(GMT-08:00) Pacific Time" className="glass-input" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      rows={4} 
                      className="glass-input w-full rounded-md resize-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="glass-card p-8">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary/80" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked={userData?.notifications.email} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="product-updates" className="font-normal">Product Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about new features and improvements</p>
                        </div>
                        <Switch id="product-updates" defaultChecked={userData?.notifications.updates} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing-emails" className="font-normal">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                        </div>
                        <Switch id="marketing-emails" defaultChecked={userData?.notifications.marketing} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">In-App Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="font-normal">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                        </div>
                        <Switch id="push-notifications" defaultChecked={userData?.notifications.push} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="report-ready" className="font-normal">Report Ready Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified when reports are ready for viewing</p>
                        </div>
                        <Switch id="report-ready" defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="glass-card p-8">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-primary/80" />
                  Security Settings
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" className="glass-input" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" className="glass-input" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" className="glass-input" />
                        </div>
                      </div>
                      <Button className="glass-button">Update Password</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-normal">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" defaultChecked={false} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Sessions</h3>
                    <div className="glass-panel p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">MacOS - Chrome - California, USA</p>
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "connections" && (
              <Card className="glass-card p-8">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary/80" />
                  Data Connections
                </h2>
                
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">Manage your connections to external data sources and services.</p>
                  
                  <div className="space-y-4">
                    {userData?.connections.map((connection, index) => (
                      <div key={index} className="glass-panel p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            connection.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                            connection.status === 'error' ? 'bg-red-500/10 text-red-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            <Database className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{connection.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                connection.status === 'connected' ? 'bg-green-400' :
                                connection.status === 'error' ? 'bg-red-400' :
                                'bg-blue-400'
                              }`}></span>
                              <span className="capitalize">{connection.status}</span>
                              {connection.status === 'connected' && (
                                <span className="ml-2">• Last sync: {connection.lastSync}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="ghost" className="text-primary">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="glass-button">
                    Connect New Data Source
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card className="glass-card p-8">
                <h2 className="text-xl font-medium mb-6 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-primary/80" />
                  Appearance Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Theme</h3>
                    <div className="flex space-x-4">
                      <div className="bg-[#1c1c1e] border-2 border-primary rounded-lg w-24 h-24 flex items-center justify-center cursor-pointer">
                        <span className="text-sm text-white">Dark</span>
                      </div>
                      <div className="bg-white border border-border rounded-lg w-24 h-24 flex items-center justify-center cursor-pointer">
                        <span className="text-sm text-black">Light</span>
                      </div>
                      <div className="bg-gradient-to-b from-white to-[#1c1c1e] border border-border rounded-lg w-24 h-24 flex items-center justify-center cursor-pointer">
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Display Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="compact-mode" className="font-normal">Compact Mode</Label>
                          <p className="text-sm text-muted-foreground">Use more condensed layouts for dense information</p>
                        </div>
                        <Switch id="compact-mode" defaultChecked={userData?.appearance.compact} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="animations" className="font-normal">Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                        </div>
                        <Switch id="animations" defaultChecked={userData?.appearance.animations} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="high-contrast" className="font-normal">High Contrast</Label>
                          <p className="text-sm text-muted-foreground">Increase contrast for better accessibility</p>
                        </div>
                        <Switch id="high-contrast" defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <select className="glass-input rounded-md py-2 px-3 bg-[#1c1c1e] text-foreground border border-input w-full">
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
