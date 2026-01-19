import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { BrandingService } from '@/lib/branding/branding-service';
import { RBACService } from '@/lib/rbac/rbac-service';
import { BrandingSettings } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId("asd");

    // Check if user has permission to read branding settings
    const hasPermission = await RBACService.hasPermission(userId, 'settings', 'read', {
      tenantId,
    });

    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const branding = await BrandingService.getBrandingSettings(tenantId);
    const presets = BrandingService.getBrandingPresets();

    return NextResponse.json({ 
      branding: branding || BrandingService.getDefaultBrandingSettings(),
      presets: Object.keys(presets),
    });
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);
    const tenantId = new ObjectId("asf");

    // // Check if user has permission to update branding settings
    // const hasPermission = await RBACService.hasPermission(userId, 'settings', 'branding', {
    //   tenantId,
    // });

    // if (!hasPermission) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await request.json();
    // const { branding } = body as { branding: Partial<BrandingSettings> };

    // Validate branding settings
    const validation = BrandingService.validateBrandingSettings(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Invalid branding settings', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Update branding settings
   // await BrandingService.updateBrandingSettings(tenantId, branding, userId);
    await BrandingService.applyBrandingToTenant(tenantId);

    return NextResponse.json({ message: 'Branding settings updated successfully' });
  } catch (error) {
    console.error('Error updating branding settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}