"use client";

import { useState, useTransition, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "@/store/store";
import {
  setWebsites as setWebsitesAction,
  setCurrentWebsite as setCurrentWebsiteAction,
} from "@/hooks/slices/websites/WebsiteSlice";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";

import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { clearProducts } from "@/hooks/slices/product/ProductSlice";
import {
  setCurrentTenants,
  setTenants,
} from "@/hooks/slices/tenants/TenantSlice";
import { toCreateHref } from "@/lib/utils";

type AppShellClientProps = {
  children: React.ReactNode;
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
  tenants: any[];
  currentTenant: any;
  loggedinTenant: any | null;
  currentagency: any;
  agencies: any[];
};

export function AppShellClient({
  children,
  websites,
  currentWebsite: initialCurrentWebsite,
  user,
  tenants,
  currentTenant: initialCurrentTenant,
  loggedinTenant,
  currentagency: initialCurrentAgency,
  agencies,
}: AppShellClientProps) {
  const [currentWebsite, setCurrentWebsite] = useState(initialCurrentWebsite);
  const [currentTenant, setCurrentTenant] = useState(initialCurrentTenant);
  const [currentAgency, setCurrentAgency] = useState(initialCurrentAgency);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const query = useSearchParams();
  const tenantId = query.get("tenantId");
  const businessid = query.get("businessid");
  // const url = params.website;
  const url = Array.isArray(params.website)
    ? params.website[0]
    : params.website;
  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearCategories());
    dispatch(clearProducts());
  };
  const handleWebsiteChange = async (websiteId: string) => {
    const newWebsite = websites.find((w) => w._id === websiteId) || null;
    setCurrentWebsite(newWebsite);
    try {
      // Call API to update the current website cookie
      const response = await fetch(`/api/session/website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId }),
      });

      let href = toCreateHref(
        newWebsite?.primaryDomain != undefined &&
          typeof newWebsite.primaryDomain == "string"
          ? newWebsite!.primaryDomain
          : "",
        tenantId,
        businessid,
        user?.role!
      );

      if (response.ok) {
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
        window.location.href = href;
        // router.push("/admin")
      } else {
        console.error("Failed to update website context");
        // Revert the optimistic update
        setCurrentWebsite(initialCurrentWebsite);
      }
    } catch (error) {
      console.error("Error updating website context:", error);
      setCurrentWebsite(initialCurrentWebsite);
    }
  };

  const handleTenantChange = async (tenantId: string) => {
    const newTenant = tenants.find((w) => w._id === tenantId) || null;
    setCurrentTenant(newTenant);
    try {
      // Call API to update the current website cookie
      const response = await fetch(
        `/api/session/tenant?businessid=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tenantId }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const { website_id, tenant } = json;
        console.log(tenant);
        const href = `/admin/websites/${website_id}?businessid=${businessid}&tenantId=${tenant}`;
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
        window.location.href = href;
        // router.push("/admin")
      } else {
        console.error("Failed to update Business context");
        // Revert the optimistic update
        setCurrentTenant(initialCurrentTenant);
      }
    } catch (error) {
      console.error("Error updating Business context:", error);
      setCurrentTenant(initialCurrentTenant);
    }
  };

  const handleAgencyChange = async (agencyId: string) => {
    const newagency = tenants.find((w) => w._id === agencyId) || null;
    setCurrentAgency(newagency);
    try {
      // Call API to update the current website cookie
      const response = await fetch(
        `/api/session/agency?agencyid=${businessid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agencyId }),
        }
      );
      if (response.ok) {
        const json = await response.json();
        const { website_id, business, agency } = json;
        const href = `/admin/websites/${website_id}?businessid=${agency}&tenantId=${business}`;
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
        window.location.href = href;
        // router.push("/admin")
      } else {
        console.error("Failed to update agency context");
        // Revert the optimistic update
        setCurrentAgency(initialCurrentAgency);
      }
    } catch (error) {
      console.error("Error updating agency context:", error);
      setCurrentAgency(initialCurrentAgency);
    }
  };

  useEffect(() => {
    if (websites && websites.length > 0) {
      dispatch(setTenants(tenants));
      dispatch(setWebsitesAction(websites));
    }
    // also set current website in redux when initialCurrentWebsite is provided
    if (initialCurrentWebsite) {
      dispatch(setCurrentWebsiteAction(initialCurrentWebsite));
      dispatch(setCurrentTenants(initialCurrentTenant));
    }
  }, [
    dispatch,
    websites,
    initialCurrentWebsite,
    initialCurrentTenant,
    tenants,
  ]);

  return (
    <AppShell
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
      onWebsiteChange={handleWebsiteChange}
      onTenantChange={handleTenantChange}
      onAgencyChage={handleAgencyChange}
      tenants={tenants}
      currentTenant={currentTenant}
      loggedinTenant={loggedinTenant}
      agencies={agencies}
      currentagency={currentAgency}
    >
      {children}
    </AppShell>
  );
}
