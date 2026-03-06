'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Palette, Upload, RotateCcw, Save, Eye } from 'lucide-react';
import { BrandingSettings } from '@/types';
import { toast } from 'sonner';

interface BrandingCustomizerProps {
  className?: string;
}

const COLOR_PRESETS = {
  default: {
    name: 'Default Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#0f172a',
    },
  },
  dark: {
    name: 'Dark Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#0f172a',
      foreground: '#f8fafc',
    },
  },
  green: {
    name: 'Nature Green',
    colors: {
      primary: '#10b981',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#111827',
    },
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#111827',
    },
  },
  red: {
    name: 'Bold Red',
    colors: {
      primary: '#ef4444',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#111827',
    },
  },
};

export default function BrandingCustomizer({ className }: BrandingCustomizerProps) {
  const { data: session } = useSession();
  const [branding, setBranding] = useState<BrandingSettings>({
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      input: '#ffffff',
      ring: '#3b82f6',
    },
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchBrandingSettings();
  }, []);

  const fetchBrandingSettings = async () => {
    try {
      const response = await fetch('/api/admin/branding');
      if (response.ok) {
        const data = await response.json();
        setBranding(data.branding);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      toast.error('Failed to load branding settings');
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setBranding(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/admin/branding/logo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setBranding(prev => ({
          ...prev,
          logo: {
            url: data.logoUrl,
            width: 200,
            height: 60,
          },
        }));
        toast.success('Logo uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = async (presetName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/branding/presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preset: presetName }),
      });

      if (response.ok) {
        await fetchBrandingSettings();
        toast.success(`${COLOR_PRESETS[presetName as keyof typeof COLOR_PRESETS].name} preset applied`);
      } else {
        throw new Error('Failed to apply preset');
      }
    } catch (error) {
      console.error('Error applying preset:', error);
      toast.error('Failed to apply preset');
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branding }),
      });

      if (response.ok) {
        toast.success('Branding settings saved successfully');
        // Apply the branding to the current page
        applyBrandingToPage();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save branding');
      }
    } catch (error: any) {
      console.error('Error saving branding:', error);
      toast.error(error.message || 'Failed to save branding settings');
    } finally {
      setLoading(false);
    }
  };

  const applyBrandingToPage = () => {
    const root = document.documentElement;
    Object.entries(branding.colors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key}`, value);
      }
    });
  };

  const resetToDefault = () => {
    setBranding({
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: '#f1f5f9',
        mutedForeground: '#64748b',
        border: '#e2e8f0',
        input: '#ffffff',
        ring: '#3b82f6',
      },
    });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      applyBrandingToPage();
    } else {
      // Reset to original styles
      window.location.reload();
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Brand Customization</h2>
          <p className="text-muted-foreground">
            Customize your admin panel's appearance and branding
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={togglePreview}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{previewMode ? 'Exit Preview' : 'Preview'}</span>
          </Button>
          <Button
            onClick={saveBranding}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the color palette for your admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(branding.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id={key}
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={resetToDefault}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset to Default</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>
                Upload and configure your brand logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {branding.logo?.url && (
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={branding.logo.url}
                    alt="Current logo"
                    className="h-16 w-auto object-contain"
                  />
                  <div>
                    <p className="font-medium">Current Logo</p>
                    <p className="text-sm text-muted-foreground">
                      {branding.logo.width}x{branding.logo.height}px
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="logo-upload">Upload New Logo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={loading}
                  />
                  <Button
                    variant="outline"
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommended: PNG or SVG format, max 2MB, 200x60px
                </p>
              </div>

              {branding.logo?.url && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-width">Width (px)</Label>
                    <Input
                      id="logo-width"
                      type="number"
                      value={branding.logo.width || 200}
                      onChange={(e) => setBranding(prev => ({
                        ...prev,
                        logo: {
                          ...prev.logo!,
                          width: parseInt(e.target.value) || 200,
                        },
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-height">Height (px)</Label>
                    <Input
                      id="logo-height"
                      type="number"
                      value={branding.logo.height || 60}
                      onChange={(e) => setBranding(prev => ({
                        ...prev,
                        logo: {
                          ...prev.logo!,
                          height: parseInt(e.target.value) || 60,
                        },
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Presets</CardTitle>
              <CardDescription>
                Quick start with pre-designed color schemes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                  <div
                    key={key}
                    className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => applyPreset(key)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{preset.name}</h4>
                      <Badge variant="outline">
                        <Palette className="h-3 w-3 mr-1" />
                        Apply
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      {Object.entries(preset.colors).slice(0, 5).map(([colorKey, colorValue]) => (
                        <div
                          key={colorKey}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: colorValue }}
                          title={`${colorKey}: ${colorValue}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>
                Add custom CSS for advanced styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  placeholder="/* Add your custom CSS here */
.admin-panel {
  /* Custom styles */
}"
                  value={branding.customCSS || ''}
                  onChange={(e) => setBranding(prev => ({
                    ...prev,
                    customCSS: e.target.value,
                  }))}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Add custom CSS to further customize your admin panel appearance.
                  Use CSS variables like var(--primary) to reference your color scheme.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Font Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heading-font">Heading Font</Label>
                    <Select
                      value={branding.fonts?.heading || ''}
                      onValueChange={(value) => setBranding(prev => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          heading: value,
                        },
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select heading font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body-font">Body Font</Label>
                    <Select
                      value={branding.fonts?.body || ''}
                      onValueChange={(value) => setBranding(prev => ({
                        ...prev,
                        fonts: {
                          ...prev.fonts,
                          body: value,
                        },
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select body font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}