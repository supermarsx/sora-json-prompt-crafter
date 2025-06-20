
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuration Dashboard</h1>
          <p className="text-gray-600">Configure your application settings and generate the corresponding JSON configuration.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Controls Panel */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Configuration Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Generated JSON
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="h-full overflow-y-auto">
                <pre className="p-6 text-sm font-mono text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
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
