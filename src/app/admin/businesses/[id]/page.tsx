import { Badge } from "@/components/ui/badge";
import { IBusiness } from "@/models/business";
import { CheckCircle2, XCircle } from "lucide-react";
import ShowBussinesById from "@/components/admin/business/businessID/ShowBussinesById";
import { auth } from "@/auth";

function cn(...c: (string | null | undefined | false)[]) {
  return c.filter(Boolean).join(" ");
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusPill(status?: string) {
  const s = (status || "").toLowerCase();
  const ok = s === "active";
  return (
    <Badge
      className={cn(
        "rounded-full",
        ok
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "bg-slate-700 text-white hover:bg-slate-700"
      )}
    >
      {status || "—"}
    </Badge>
  );
}

function FeatureRow({ label, enabled }: { label: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-white px-4 py-3">
      <div className="text-sm font-medium text-slate-900">{label}</div>
      {enabled ? (
        <span className="inline-flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Enabled
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm text-slate-500">
          <XCircle className="h-4 w-4" />
          Disabled
        </span>
      )}
    </div>
  );
}

export default async function BusinesswithID({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  let id = param.id;
  const sesssion = await auth();

  const req = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/business/${id}`
  );

  const res = await req.json();

  if (!res.success) {
    return <div className="p-6 text-sm text-slate-600">Business not found</div>;
  }
  const business: IBusiness = res.data;

  return (
    <>
      <ShowBussinesById user={sesssion?.user!} business={business} />
    </>
  );
}
