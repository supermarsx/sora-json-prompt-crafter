
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardOptions } from './Dashboard';

interface ControlPanelProps {
  options: DashboardOptions;
  updateOptions: (updates: Partial<DashboardOptions>) => void;
  updateNestedOptions: (path: string, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  updateOptions,
  updateNestedOptions,
}) => {
  const availableFeatures = [
    { id: 'api', label: 'REST API' },
    { id: 'auth', label: 'Authentication' },
    { id: 'websocket', label: 'WebSocket Support' },
    { id: 'caching', label: 'Redis Caching' },
    { id: 'monitoring', label: 'Health Monitoring' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    const currentFeatures = options.features;
    const newFeatures = checked
      ? [...currentFeatures, featureId]
      : currentFeatures.filter(f => f !== featureId);
    updateOptions({ features: newFeatures });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Basic</Badge>
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Application Name</Label>
            <Input
              id="name"
              value={options.name}
              onChange={(e) => updateOptions({ name: e.target.value })}
              placeholder="Enter application name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={options.version}
              onChange={(e) => updateOptions({ version: e.target.value })}
              placeholder="e.g., 1.0.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select
              value={options.environment}
              onValueChange={(value: 'development' | 'staging' | 'production') =>
                updateOptions({ environment: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Features</Badge>
            Enabled Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {availableFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={feature.id}
                  checked={options.features.includes(feature.id)}
                  onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked === true)}
                />
                <Label htmlFor={feature.id} className="text-sm font-medium cursor-pointer flex-1">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">Database</Badge>
            Database Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Database Type</Label>
            <Select
              value={options.database.type}
              onValueChange={(value: 'postgresql' | 'mysql' | 'mongodb') =>
                updateNestedOptions('database.type', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="ssl" className="text-sm font-medium">Enable SSL</Label>
              <p className="text-xs text-muted-foreground">Secure database connections</p>
            </div>
            <Switch
              id="ssl"
              checked={options.database.ssl}
              onCheckedChange={(checked) => updateNestedOptions('database.ssl', checked)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Connection Pool Size</Label>
              <Badge variant="secondary">{options.database.poolSize}</Badge>
            </div>
            <Slider
              value={[options.database.poolSize]}
              onValueChange={(value) => updateNestedOptions('database.poolSize', value[0])}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300">Auth</Badge>
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="auth-enabled" className="text-sm font-medium">Enable Authentication</Label>
              <p className="text-xs text-muted-foreground">Require user authentication</p>
            </div>
            <Switch
              id="auth-enabled"
              checked={options.authentication.enabled}
              onCheckedChange={(checked) => updateNestedOptions('authentication.enabled', checked)}
            />
          </div>

          {options.authentication.enabled && (
            <>
              <div className="space-y-2">
                <Label>Authentication Provider</Label>
                <Select
                  value={options.authentication.provider}
                  onValueChange={(value: 'jwt' | 'oauth' | 'basic') =>
                    updateNestedOptions('authentication.provider', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jwt">JWT Tokens</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Session Timeout (seconds)</Label>
                  <Badge variant="secondary">{options.authentication.timeout}</Badge>
                </div>
                <Slider
                  value={[options.authentication.timeout]}
                  onValueChange={(value) => updateNestedOptions('authentication.timeout', value[0])}
                  max={86400}
                  min={300}
                  step={300}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Logging */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">Logging</Badge>
            Logging Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="logging-enabled" className="text-sm font-medium">Enable Logging</Label>
              <p className="text-xs text-muted-foreground">Record application events</p>
            </div>
            <Switch
              id="logging-enabled"
              checked={options.logging.enabled}
              onCheckedChange={(checked) => updateNestedOptions('logging.enabled', checked)}
            />
          </div>

          {options.logging.enabled && (
            <div className="space-y-2">
              <Label>Log Level</Label>
              <Select
                value={options.logging.level}
                onValueChange={(value: 'debug' | 'info' | 'warn' | 'error') =>
                  updateNestedOptions('logging.level', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
