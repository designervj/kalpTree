"use client";
import { useEffect, useMemo, useState } from "react";
import { Globe, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createWebsite, deleteWebsite, getAllWebsites } from "@/hooks/slices/websites/WebsiteThunk";
import { toast } from "sonner";
import { Website } from "@/components/admin/AppShell";

export default function WebsitesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.user)
  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState<"WEBSITE_ONLY" | "ECOMMERCE">(
    "WEBSITE_ONLY"
  );

  const dispatch = useDispatch<AppDispatch>()
  const [primaryDomains, setPrimaryDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState("");
  const [domain, setDomain] = useState("");
  const { websites, hasfetched } = useSelector((state: RootState) => state.websites)

  const allWebsite = useMemo(() => {
    if (websites && websites.length > 0)
      return websites
  }, [websites])

  useEffect(() => {
    if (user && user.tenantId &&
      !hasfetched && websites.length == 0) {
      console.log("websitite calloing")
      dispatch(getAllWebsites({ tenantId: user.tenantId }))
    }
  }, [hasfetched, websites, user])

  const addDomain = () => {
    if (currentDomain.trim()) {
      setPrimaryDomains([...primaryDomains, currentDomain.trim()]);
      setCurrentDomain("");
    }
  };

  const removeDomain = (index: number) => {
    setPrimaryDomains(primaryDomains.filter((_, i) => i !== index));
  };

  const handleDomainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDomain();
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !user.tenantId)
      toast.error("Missing tenant Id")
    // const res = await fetch("/api/domain", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     name,
    //     serviceType,
    //     primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
    //   }),
    // });
    const data = {
      name: name,
      tenantId: user?.tenantId,
      primaryDomain: primaryDomains.length > 0 ? primaryDomains : [currentDomain],
      systemSubdomain: "",
      serviceType: serviceType,
      status: "active" as const
    }

    const response = await dispatch(createWebsite(data)).unwrap()

    console.log(response);
    if (response) {
      setName("");
      setPrimaryDomains([]);
      setCurrentDomain("");
      setServiceType("WEBSITE_ONLY");
      // load();
    } else {
      //   let msg = "";
      //   try {
      //     msg = (await response.json()).error;
      //   } catch {}
      //   alert("Create failed: " + (msg || response.status));
      // }
    };
  }
  const setCurrent = async (websiteId: string) => {
    const res = await fetch("/api/session/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
    });
    // if (res.ok) load();
  };


  const handleDeleteDomain = async (data: Website) => {
    if (data && !data._id)
      toast.error("Missing the object Id of selected Website")
    try {
      const response = await dispatch(deleteWebsite(String(data?._id ?? ""))).unwrap()
    } catch (err) {
      console.log("error on deleting domain")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Websites
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your domains and service configurations.
          </p>
        </div>
      </div>

      {/* Creation Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">
            Create New Website
          </h2>
        </div>
        <form onSubmit={onCreate} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Site Name
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-colors"
                placeholder="My Business Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Service Type
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-colors"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
              >
                <option value="WEBSITE_ONLY">Website Only</option>
                <option value="ECOMMERCE">E-Commerce</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Primary Domains
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-colors"
                  value={currentDomain}
                  onChange={(e) => setCurrentDomain(e.target.value)}
                  onKeyPress={handleDomainKeyPress}
                  placeholder="https://www.example.com"
                />
              </div>
              <button
                type="button"
                onClick={addDomain}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors h-10"
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </button>
            </div>

            {/* Domain Badges */}
            {primaryDomains.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {primaryDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200"
                  >
                    {domain}
                    <button
                      type="button"
                      onClick={() => removeDomain(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              Create Website
            </button>
          </div>
        </form>
      </div>
      {allWebsite && allWebsite.length > 0 ? (
        <div className="mt-4">
          {(() => {
            const Ext = require("./ExtTable").default as any;
            return <Ext
              items={allWebsite}
              currentId={currentId}
              deleteData={handleDeleteDomain}

            />;
          })()}
        </div>
      ) : (
        !loading && <p>No websites yet.</p>
      )}
    </div>
  );
}
