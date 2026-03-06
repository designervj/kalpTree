import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { BrandingSettings, Tenant } from '@/types';

export class BrandingService {
  private static db = getDb();

  // Get branding settings for a tenant
  static async getBrandingSettings(tenantId: ObjectId): Promise<BrandingSettings | null> {
    const db = await this.db;
    const tenant = await db.collection('tenants').findOne({ _id: tenantId }) as Tenant | null;
    return tenant?.branding || null;
  }

  // Update branding settings
  static async updateBrandingSettings(
    tenantId: ObjectId,
    branding: Partial<BrandingSettings>,
    updatedBy: ObjectId
  ): Promise<void> {
    const db = await this.db;

    await db.collection('tenants').updateOne(
      { _id: tenantId },
      {
        $set: {
          branding: {
            ...branding,
          },
          updatedAt: new Date(),
        },
      }
    );

    // Log the branding update
    await db.collection('activity_logs').insertOne({
      tenantId,
      userId: updatedBy,
      action: 'update',
      resource: 'branding',
      resourceId: tenantId,
      details: {
        after: branding,
        metadata: { timestamp: new Date() },
      },
      createdAt: new Date(),
    });
  }

  // Upload and set logo
  static async uploadLogo(
    tenantId: ObjectId,
    logoFile: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
    },
    updatedBy: ObjectId
  ): Promise<string> {
    // In a real implementation, you would upload to a cloud storage service
    // For now, we'll simulate the upload and return a URL
    const logoUrl = `/uploads/logos/${tenantId}_${Date.now()}_${logoFile.originalname}`;

    // Update the tenant's branding with the new logo
    // await this.updateBrandingSettings(
    //   tenantId,
    //   {
    //     logo: {
    //       url: logoUrl,
    //       width: 200, // Default width
    //       height: 60, // Default height
    //     },
    //   },
    //   updatedBy
    // );

    return logoUrl;
  }

  // Generate CSS variables from branding settings
  static generateCSSVariables(branding: BrandingSettings): string {
    const { colors, fonts } = branding;

    let css = ':root {\n';

    // Color variables
    // if (colors.primary) css += `  --primary: ${colors.primary};\n`;
    // if (colors.secondary) css += `  --secondary: ${colors.secondary};\n`;
    // if (colors.accent) css += `  --accent: ${colors.accent};\n`;
    // if (colors.background) css += `  --background: ${colors.background};\n`;
    // if (colors.foreground) css += `  --foreground: ${colors.foreground};\n`;
    // if (colors.muted) css += `  --muted: ${colors.muted};\n`;
    // if (colors.mutedForeground) css += `  --muted-foreground: ${colors.mutedForeground};\n`;
    // if (colors.border) css += `  --border: ${colors.border};\n`;
    // if (colors.input) css += `  --input: ${colors.input};\n`;
    // if (colors.ring) css += `  --ring: ${colors.ring};\n`;

    // Font variables
    if (fonts?.heading) css += `  --font-heading: ${fonts.heading};\n`;
    if (fonts?.body) css += `  --font-body: ${fonts.body};\n`;

    css += '}\n';

    // Add custom CSS if provided
    if (branding.customCSS) {
      css += '\n' + branding.customCSS;
    }

    return css;
  }

  // Get default branding settings
  static getDefaultBrandingSettings(): BrandingSettings {
    return {
      colors: {
        primary: '#3b82f6', // Blue
        secondary: '#64748b', // Slate
        accent: '#f59e0b', // Amber
        background: '#ffffff', // White
        foreground: '#0f172a', // Slate 900
        muted: '#f1f5f9', // Slate 100
        mutedForeground: '#64748b', // Slate 500
        border: '#e2e8f0', // Slate 200
        input: '#ffffff', // White
        ring: '#3b82f6', // Blue
      },
    };
  }

  // Validate branding settings
  static validateBrandingSettings(branding: Partial<BrandingSettings>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate colors
    // if (branding.colors) {
    //   const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    //   Object.entries(branding.colors).forEach(([key, value]) => {
    //     if (value && !colorRegex.test(value)) {
    //       errors.push(`Invalid color format for ${key}: ${value}`);
    //     }
    //   });
    // }

    // Validate logo dimensions
    // if (branding.logo) {
    //   if (branding?.logo?.width??"" && (branding.logo.width < 50 || branding.logo.width > 500)) {
    //     errors.push('Logo width must be between 50 and 500 pixels');
    //   }
    //   if (branding?.logo?.height??"" && (branding.logo.height < 20 || branding.logo.height > 200)) {
    //     errors.push('Logo height must be between 20 and 200 pixels');
    //   }
    // }

    // Validate custom CSS (basic check)
    if (branding.customCSS) {
      if (branding.customCSS.length > 10000) {
        errors.push('Custom CSS must be less than 10,000 characters');
      }

      // Check for potentially dangerous CSS
      const dangerousPatterns = [
        /@import/i,
        /javascript:/i,
        /expression\(/i,
        /behavior:/i,
      ];

      dangerousPatterns.forEach(pattern => {
        if (pattern.test(branding.customCSS!)) {
          errors.push('Custom CSS contains potentially dangerous content');
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Apply branding to a tenant's UI
  static async applyBrandingToTenant(tenantId: ObjectId): Promise<void> {
    const branding = await this.getBrandingSettings(tenantId);
    if (!branding) return;

    // Generate CSS
    const css = this.generateCSSVariables(branding);

    // Store the generated CSS for the tenant
    const db = await this.db;
    await db.collection('tenant_styles').updateOne(
      { tenantId },
      {
        $set: {
          css,
          branding,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  // Get compiled CSS for a tenant
  static async getTenantCSS(tenantId: ObjectId): Promise<string | null> {
    const db = await this.db;
    const tenantStyle = await db.collection('tenant_styles').findOne({ tenantId });
    return tenantStyle?.css || null;
  }

  // Reset branding to default
  static async resetBrandingToDefault(tenantId: ObjectId, updatedBy: ObjectId): Promise<void> {
    const defaultBranding = this.getDefaultBrandingSettings();
    await this.updateBrandingSettings(tenantId, defaultBranding, updatedBy);
    await this.applyBrandingToTenant(tenantId);
  }

  // Clone branding from another tenant (for franchise templates)
  static async cloneBrandingFromTenant(
    sourceTenantId: ObjectId,
    targetTenantId: ObjectId,
    updatedBy: ObjectId
  ): Promise<void> {
    const sourceBranding = await this.getBrandingSettings(sourceTenantId);
    if (!sourceBranding) return;

    // Clone the branding (excluding logo URL to avoid conflicts)
    const clonedBranding: BrandingSettings = {
      ...sourceBranding,
      logo: undefined, // Don't clone logo, let target tenant upload their own
    };

    await this.updateBrandingSettings(targetTenantId, clonedBranding, updatedBy);
    await this.applyBrandingToTenant(targetTenantId);
  }

  // Get branding presets for quick setup
  static getBrandingPresets(): Record<string, BrandingSettings> {
    return {
      default: this.getDefaultBrandingSettings(),
      dark: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#0f172a',
          foreground: '#f8fafc',
          muted: '#1e293b',
          mutedForeground: '#94a3b8',
          border: '#334155',
          input: '#1e293b',
          ring: '#3b82f6',
        },
      },
      green: {
        colors: {
          primary: '#10b981',
          secondary: '#6b7280',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#111827',
          muted: '#f3f4f6',
          mutedForeground: '#6b7280',
          border: '#d1d5db',
          input: '#ffffff',
          ring: '#10b981',
        },
      },
      purple: {
        colors: {
          primary: '#8b5cf6',
          secondary: '#6b7280',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#111827',
          muted: '#f3f4f6',
          mutedForeground: '#6b7280',
          border: '#d1d5db',
          input: '#ffffff',
          ring: '#8b5cf6',
        },
      },
      red: {
        colors: {
          primary: '#ef4444',
          secondary: '#6b7280',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#111827',
          muted: '#f3f4f6',
          mutedForeground: '#6b7280',
          border: '#d1d5db',
          input: '#ffffff',
          ring: '#ef4444',
        },
      },
    };
  }

  // Apply a preset to a tenant
  static async applyBrandingPreset(
    tenantId: ObjectId,
    presetName: string,
    updatedBy: ObjectId
  ): Promise<void> {
    const presets = this.getBrandingPresets();
    const preset = presets[presetName];

    if (!preset) {
      throw new Error(`Branding preset '${presetName}' not found`);
    }

    await this.updateBrandingSettings(tenantId, preset, updatedBy);
    await this.applyBrandingToTenant(tenantId);
  }
}