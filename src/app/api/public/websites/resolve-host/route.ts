import { NextResponse } from 'next/server';
import { websiteService } from '@/lib/websites/website-service';
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const qHost = url.searchParams.get('host');
    const fromHeader = (new Headers(req.headers)).get('host') || '';
    const selected = (qHost || fromHeader).split(':')[0].toLowerCase().trim();
    if (!selected) return NextResponse.json({ ok: false, error: 'Missing host' }, { status: 400 });

    const found = await websiteService.getByHost(selected);
    if (!found) return NextResponse.json({ ok: true, matched: false });

    return NextResponse.json({
      ok: true,
      matched: true,
      websiteId: found.websiteId,
      tenantId: String(found.tenantId),
      systemSubdomain: found.systemSubdomain,
      primaryDomain: found.primaryDomain || null,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal Error';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
