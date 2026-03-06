"use client";
import { useState } from 'react';

export default function OnboardingPage() {
  const [tenantSlug, setTenantSlug] = useState('demo2');
  const [tenantName, setTenantName] = useState('Demo Tenant 2');
  const [adminEmail, setAdminEmail] = useState('owner@example.com');
  const [adminPassword, setAdminPassword] = useState('changeme');
  const [websiteName, setWebsiteName] = useState('My Website');
  const [serviceType, setServiceType] = useState<'WEBSITE_ONLY' | 'ECOMMERCE'>('WEBSITE_ONLY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/public/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, tenantName, adminEmail, adminPassword, websiteName, serviceType })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to onboard');
      window.location.href = `/auth/signin?tenant=${encodeURIComponent(data.tenantSlug)}`;
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Tenant Onboarding</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tenant Slug</label>
          <input value={tenantSlug} onChange={e => setTenantSlug(e.target.value)} className="border rounded p-2 w-full" placeholder="your-tenant" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tenant Name</label>
          <input value={tenantName} onChange={e => setTenantName(e.target.value)} className="border rounded p-2 w-full" placeholder="Your Tenant Inc." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Admin Email</label>
            <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Admin Password</label>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="border rounded p-2 w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Website Name</label>
          <input value={websiteName} onChange={e => setWebsiteName(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Service Type</label>
          <select value={serviceType} onChange={e => setServiceType(e.target.value as any)} className="border rounded p-2 w-full">
            <option value="WEBSITE_ONLY">Website Only</option>
            <option value="ECOMMERCE">Ecommerce</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="bg-black text-white rounded px-4 py-2">{loading ? 'Creating...' : 'Create Tenant'}</button>
      </form>
    </div>
  );
}

