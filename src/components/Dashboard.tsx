
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ControlPanel } from './ControlPanel';

export interface DashboardOptions {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: string[];
  database: {
    type: 'postgresql' | 'mysql' | 'mongodb';
    ssl: boolean;
    poolSize: number;
  };
  authentication: {
    enabled: boolean;
    provider: 'jwt' | 'oauth' | 'basic';
    timeout: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enabled: boolean;
  };
}

const Dashboard = () => {
  const [options, setOptions] = useState<DashboardOptions>({
    name: 'My Application',
    version: '1.0.0',
    environment: 'development',
    features: ['api', 'auth'],
    database: {
      type: 'postgresql',
      ssl: false,
      poolSize: 10,
    },
    authentication: {
      enabled: true,
      provider: 'jwt',
      timeout: 3600,
    },
    logging: {
      level: 'info',
      enabled: true,
    },
  });

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    setJsonString(JSON.stringify(options, null, 2));
  }, [options]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success('JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const updateOptions = (updates: Partial<DashboardOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  };

  const updateNestedOptions = (path: string, value: any) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: any = newOptions;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newOptions;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Configuration Dashboard</h1>
          <p className="text-muted-foreground">Configure your application settings and generate the corresponding JSON configuration.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Controls Panel */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Configuration Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ControlPanel 
                  options={options} 
                  updateOptions={updateOptions}
                  updateNestedOptions={updateNestedOptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* JSON Preview Panel */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Generated JSON
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>{jsonString}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
