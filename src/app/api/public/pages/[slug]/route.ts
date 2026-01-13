import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { pageService } from '@/modules/website/page-service';
import { auth } from '@/auth';

// Public: no auth required; uses selected website cookie or domain middleware ahead of time
export async function GET(req: Request) {
  // const session = await auth(); // optional, but we won’t require it
  // const websiteId = (await cookies()).get('current_website_id')?.value;
  // const tenantId = (await headers()).get('x-tenant-id') || '';
  // // const tenantId = ("asad" as string | undefined) || (await headers()).get('x-tenant-id') || '';

  // if (!tenantId) return NextResponse.json({ error: 'Tenant unresolved' }, { status: 400 });
  // const doc = await pageService.getBySlugForWebsite(tenantId, resolvedParams.slug, websiteId);
  // if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // return NextResponse.json({ item: doc });
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const tenantId = searchParams.get('tenantId');

  console.log('Slug:', slug);
  console.log('TenantId:', tenantId);

  if (!slug || !tenantId) {
    return NextResponse.json({ error: 'Missing slug or tenantId' }, { status: 400 });
  }

  // // Get website ID from cookies if available
  // const websiteId = (await cookies()).get('current_website_id')?.value;

  const doc = await pageService.getPageBySlug(tenantId, slug);
     
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: doc });
}

