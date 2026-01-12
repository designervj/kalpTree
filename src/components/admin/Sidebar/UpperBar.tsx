"use client";

import {
  onAgencyChange,
  onBusinessChange,
  onWebSiteChange,
} from "@/hooks/slices/dashboardSlice/dashBoardSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Building2, ChevronDown, Globe2 } from "lucide-react";

export const UpperBar = () => {
  const {
    user,
    agencies,
    business: tenants,
    websites,
    currentAgency,
    currentWebsite,
    currentbusiness: currentTenant,
  } = useSelector((state: RootState) => state.dashboardDetails);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-1 items-center gap-4 px-4 py-2 bg-white border-b">
      {/* ================= Agency ================= */}
      {user?.role === "superadmin" && agencies.length > 0 && (
        <Select
          value={currentAgency?._id ?? ""}
          onValueChange={(agencyId) => dispatch(onAgencyChange({ agencyId }))}
        >
          <SelectTrigger className="h-12 min-w-[240px] rounded-lg border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate font-medium">
                  {currentAgency?.name || "Select Agency"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </div>
          </SelectTrigger>

          <SelectContent className="w-[260px]">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Agencies
            </div>
            {agencies.map((agency) => (
              <SelectItem key={agency._id} value={agency._id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{agency.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* ================= Business ================= */}
      {(user?.role === "agency" || user?.role === "superadmin") &&
        tenants.length > 0 && (
          <Select
            value={String(currentTenant?._id) ?? ""}
            onValueChange={(tenantId) =>
              dispatch(onBusinessChange({ tenantId }))
            }
          >
            <SelectTrigger className="h-12 min-w-[240px] rounded-lg border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">
                    {currentTenant?.name || "Select Business"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </div>
            </SelectTrigger>

            <SelectContent className="w-[260px]">
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Businesses
              </div>
              {tenants.map((tenant) => (
                <SelectItem key={tenant._id} value={tenant._id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{tenant.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

      {/* ================= Website ================= */}
      {websites.length > 0 && (
        <Select
          value={currentWebsite?._id ?? ""}
          onValueChange={(websiteId) =>
            dispatch(onWebSiteChange({ websiteId }))
          }
        >
          <SelectTrigger className="h-12 min-w-[260px] rounded-lg border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate font-medium">
                  {currentWebsite?.name || "Select Website"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </div>
          </SelectTrigger>

          <SelectContent className="w-[300px]">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Websites
            </div>
            {websites.map((site) => (
              <SelectItem key={site._id} value={site._id}>
                <div className="flex flex-col">
                  <span className="font-medium">{site.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {site.primaryDomain || site.systemSubdomain}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
