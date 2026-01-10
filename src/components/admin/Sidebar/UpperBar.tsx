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
    currentAgency: currentagency,
    currentWebsite,
    currentbusiness: currentTenant,
    loggedinTenant,
  } = useSelector((state: RootState) => state.dashboardDetails);

  const dispatch = useDispatch<AppDispatch>();

  const onWebsiteChange = (websiteId: string) => {
    dispatch(onWebSiteChange({ websiteId }));
  };

  const onTenantChange = (tenantId: string) => {
    dispatch(onBusinessChange({ tenantId }));
  };

  const onAgencyChage = (agencyId: string) => {
    dispatch(onAgencyChange({ agencyId }));
  };

  return (
    <>
      {user?.role == "superadmin" && (
        <div className="relative mt-2">
          {agencies.length > 0 && (
            <div className={cn("px-3 pt-2 px-2")}>
              <div className="relative">
                <Select
                  value={currentagency?._id || ""}
                  onValueChange={onAgencyChage}
                >
                  <SelectTrigger
                    className={cn(
                      "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                      "text-left px-4 py-2 h-[500px]",
                      "[&>svg]:hidden justify-center px-2"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base text-gray-900">
                        {currentagency?.name || ""}
                      </span>
                      <ChevronDown className="h-4 w-4 text-black/70" />
                    </div>
                  </SelectTrigger>

                  <SelectContent className="w-[260px] rounded-lg border shadow-lg ">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      Tenants
                    </div>

                    {agencies.map((agency) => (
                      <SelectItem key={agency._id} value={agency._id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-black/60" />
                          <span className="text-sm font-medium">
                            {agency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Floating Label */}
                <label
                  className={cn(
                    "absolute left-7 transition-all duration-200 pointer-events-none bg-white px-1",
                    currentTenant?._id
                      ? "-top-2.5 text-xs text-gray-600"
                      : "top-6 text-base text-gray-500"
                  )}
                >
                  Select Agency
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {(user?.role == "agency" || user?.role == "superadmin") && (
        <div className="relative mt-2">
          {tenants.length > 0 && (
            <div className={cn("px-3 pt-2 px-2")}>
              <div className="relative">
                <Select
                  value={currentTenant?._id || ""}
                  onValueChange={onTenantChange}
                >
                  <SelectTrigger
                    className={cn(
                      "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                      "text-left px-4 py-2 h-[500px]",
                      "[&>svg]:hidden justify-center px-2"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base text-gray-900">
                        {currentTenant?.name || ""}
                      </span>
                      <ChevronDown className="h-4 w-4 text-black/70" />
                    </div>
                  </SelectTrigger>

                  <SelectContent className="w-[260px] rounded-lg border shadow-lg ">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      Tenants
                    </div>

                    {tenants.map((tenant) => (
                      <SelectItem key={tenant._id} value={tenant._id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-black/60" />
                          <span className="text-sm font-medium">
                            {tenant.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Floating Label */}
                <label
                  className={cn(
                    "absolute left-7 transition-all duration-200 pointer-events-none bg-white px-1",
                    currentTenant?._id
                      ? "-top-2.5 text-xs text-gray-600"
                      : "top-6 text-base text-gray-500"
                  )}
                >
                  Select Businesses
                </label>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="relative mt-2">
        {websites.length > 0 && (
          <div className={cn("px-3 pt-2 px-2")}>
            <div className="relative">
              <Select
                value={currentWebsite?._id || ""}
                onValueChange={onWebsiteChange}
              >
                <SelectTrigger
                  className={cn(
                    "h-14 w-full rounded-lg bg-white border-2 border-gray-600 focus:ring-2 focus:ring-gray-600 focus:border-gray-600",
                    "text-left px-4 py-2 h-[500px]",
                    "[&>svg]:hidden justify-center px-2"
                  )}
                >
                  {true ? (
                    <div className="flex items-center justify-between w-full">
                      {/* <Globe2 className="h-4 w-4 text-black/60" /> */}
                      <span className="text-sm font-medium truncate">
                        {currentWebsite?.name || ""}
                      </span>
                      <ChevronDown className="h-4 w-4 text-black/70" />
                    </div>
                  ) : (
                    <Globe2 className="h-4 w-4 text-black/70" />
                  )}
                </SelectTrigger>

                <SelectContent className="w-[260px] rounded-lg border shadow-lg">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    Websites
                  </div>

                  {websites.map((site) => (
                    <SelectItem key={site._id} value={site._id}>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{site.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {site.primaryDomain || site.systemSubdomain}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Floating Label */}
              <label
                className={cn(
                  "absolute left-7  transition-all duration-200 pointer-events-none bg-white px-1",
                  currentWebsite?._id
                    ? "-top-2.5 text-xs text-gray-600"
                    : "top-6 text-base text-gray-500"
                )}
              >
                Select Website
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
