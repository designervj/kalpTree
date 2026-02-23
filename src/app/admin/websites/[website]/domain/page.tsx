"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ExtTable from "@/app/admin/domain/ExtTable";



function formatDate(date: string) {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

type DomainItem = {
  _id?: string;
  id?: string;

  name?: string;
  systemSubdomain?: string; // optional
  systemDomain?: string; // optional
  primaryDomain?: string[] | string; // optional
  primaryDomains?: string[]; // optional

  serviceType?: "WEBSITE_ONLY" | "ECOMMERCE" | "MATERIAL_LIBRARY" | string;
  websiteId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function WebsitesPage() {
  const router = useRouter();

  const [items, setItems] = useState<DomainItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [listRes, curRes] = await Promise.all([
        fetch("/api/domain", { cache: "no-store" }),
        fetch("/api/session/website", { cache: "no-store" }),
      ]);

      if (!listRes.ok) throw new Error("Failed to load domains/websites");

      const listJson = await listRes.json();
      setItems(listJson?.items || []);

      if (curRes.ok) {
        const curJson = await curRes.json();
        setCurrentId(curJson?.websiteId || null);
      } else {
        setCurrentId(null);
      }
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const processedItems = useMemo(() => {
    return (items || []).map((d) => {
      const primary =
        (Array.isArray(d.primaryDomain) ? d.primaryDomain : undefined) ||
        d.primaryDomains ||
        (typeof d.primaryDomain === "string" ? [d.primaryDomain] : []);

      const system =
        d.systemSubdomain ||
        d.systemDomain ||
        (primary?.[0]?.includes(".mahimavalenza.in")
          ? primary?.[0]
          : undefined) ||
        "-";

      const id = d._id || d.id || "";

      return {
        ...d,
        _id: id,
        websiteId: d.websiteId || id,
        systemSubdomain: system,
        primaryDomains: primary,
        createdAt: formatDate(d.createdAt || ""),
        updatedAt: formatDate(d.updatedAt || ""),
      };
    });
  }, [items]);

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <BreadCrumbPage />
          <p className="text-muted-foreground">Manage your website configurations</p>
        </div>

        <Button
          onClick={() => router.push("/admin/domain/create")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Website
        </Button>
      </div>

      <Card className="overflow-hidden">
        {/* <CardHeader className="border-b bg-transparent">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Websites</h1>
            </div>

            <Button
              onClick={() => router.push("/admin/domain/create")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Website
            </Button>
          </div>
        </CardHeader> */}

        <CardContent className="py-2">
          {/* Loading */}
          {loading && (
            <div className="py-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <ExtTable
              items={processedItems as any}
              currentId={currentId}

            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
