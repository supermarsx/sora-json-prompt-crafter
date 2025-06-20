
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    <div className="p-6 space-y-8">
      {/* Basic Settings */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg">Basic Settings</CardTitle>
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
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {availableFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={options.features.includes(feature.id)}
                  onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked === true)}
                />
                <Label htmlFor={feature.id} className="text-sm font-medium">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-lg">Database Configuration</CardTitle>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="ssl"
              checked={options.database.ssl}
              onCheckedChange={(checked) => updateNestedOptions('database.ssl', checked)}
            />
            <Label htmlFor="ssl">Enable SSL</Label>
          </div>

          <div className="space-y-2">
            <Label>Connection Pool Size: {options.database.poolSize}</Label>
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
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-lg">Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auth-enabled"
              checked={options.authentication.enabled}
              onCheckedChange={(checked) => updateNestedOptions('authentication.enabled', checked)}
            />
            <Label htmlFor="auth-enabled">Enable Authentication</Label>
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

              <div className="space-y-2">
                <Label>Session Timeout (seconds): {options.authentication.timeout}</Label>
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
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-lg">Logging Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="logging-enabled"
              checked={options.logging.enabled}
              onCheckedChange={(checked) => updateNestedOptions('logging.enabled', checked)}
            />
            <Label htmlFor="logging-enabled">Enable Logging</Label>
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
