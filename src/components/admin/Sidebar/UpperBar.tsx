"use client";

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
import { IUser } from "@/models/user";
import { setCurretAgency } from "@/hooks/slices/user/agencySlice";
import { setCurrentBusiness, setSelectedBusiness } from "@/hooks/slices/business/BusinessSlice";
import { setCurrentWebsite, setSelectedWebsite } from "@/hooks/slices/websites/WebsiteSlice";
import { IBusiness } from "@/models/business";
import { useMemo } from "react";

export const UpperBar = () => {



  const { user } = useSelector((state: RootState) => state.user)
  const { agencies, curretAgency } = useSelector((state: RootState) => state.agency)
  const { allBusiness, currentBusiness, allSelectedBusiness } = useSelector((state: RootState) => state.business)
  const { websites, currentWebsite, selectedWebsites } = useSelector((state: RootState) => state.websites)
  const dispatch = useDispatch<AppDispatch>();


  const updatedAllBusiness= useMemo(() => {
    return allSelectedBusiness
  }, [allSelectedBusiness, ])


  const updatedAllWebsites = useMemo(() => {
    return selectedWebsites
  }, [selectedWebsites])

  const updatedCurrentWebsite = useMemo(() => {
    return currentWebsite
  }, [currentWebsite])


  const handleAgencyChange = (agencyId: string) => {
    const agency = agencies.find(a => a._id?.toString() === agencyId);

    dispatch(setCurretAgency(agency || null));

    const allBus = allBusiness.filter(item => item.tenantId === agency?._id)
    console.log("allBus", allBus)
     if (allBus.length === 1) {
      dispatch(setSelectedBusiness(allBus))
      dispatch(setCurrentBusiness(allBus[0]))
      const allWeb = websites.filter(item => item.tenantId === allBus[0]?._id)
      console.log("allWeb", allWeb)
      if (allWeb) {
        dispatch(setSelectedWebsite(allWeb))
        dispatch(setCurrentWebsite(allWeb[0]))
      }
    }
   else  if (allBus.length > 1) {
      dispatch(setSelectedBusiness(allBus))
      dispatch(setCurrentBusiness(allBus[0]))
      const allWeb = websites.filter(item => item.tenantId === allBus[0]?.tenantId)
      console.log("allWeb", allWeb)
      if (allWeb) {
        dispatch(setSelectedWebsite(allWeb))
        dispatch(setCurrentWebsite(allWeb[0]))
      }
    } 
  }

  const handleBusinessChange = (tenantId: string) => {
    const business = allBusiness.find(b => b._id?.toString() === tenantId);
    dispatch(setCurrentBusiness(business || null));
    const allWeb = websites.filter(item => item.tenantId === business?._id)
    if (allWeb) {
      dispatch(setSelectedWebsite(allWeb))
      dispatch(setCurrentWebsite(allWeb[0]))
    }
  }

  const handleWebsiteChange = (websiteId: string) => {
    const website = websites.find(w => w._id?.toString() === websiteId);
    dispatch(setCurrentWebsite(website || null));

  }

  return (
    <div className="flex flex-1 items-center gap-4 px-4 py-2 bg-white border-b">
      {/* ================= Agency ================= */}
      {user?.role === "superadmin" && agencies.length > 0 && (
        <Select
          value={curretAgency?._id?.toString() ?? ""}
          onValueChange={(agencyId) => {
            handleAgencyChange(agencyId);
          }}
        >
          <SelectTrigger className="h-12 min-w-[240px] rounded-lg border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate font-medium">
                  {curretAgency?.name || "Select Agency"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </div>
          </SelectTrigger>

          <SelectContent className="w-[260px]">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Agencies
            </div>
            {agencies.map((agency: IUser) => (
              <SelectItem key={agency._id?.toString()} value={agency._id?.toString() ?? ""}>
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
        updatedAllBusiness.length > 0 && (
          <Select
            value={currentBusiness?._id?.toString() ?? ""}
            onValueChange={(tenantId) => {
              handleBusinessChange(tenantId)

            }}
          >
            <SelectTrigger className="h-12 min-w-[240px] rounded-lg border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">
                    {currentBusiness?.name || "Select Business"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </div>
            </SelectTrigger>

            <SelectContent className="w-[260px]">
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Businesses
              </div>
              {allSelectedBusiness.map((business) => (
                <SelectItem key={business._id?.toString()} value={business._id?.toString() ?? ""}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{business.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

      {/* ================= Website ================= */}
      {
        updatedAllWebsites.length > 0 && (
          <Select
            value={updatedCurrentWebsite?._id?.toString() ?? ""}
            onValueChange={(websiteId) => {
              handleWebsiteChange(websiteId)
            }}
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
              {selectedWebsites.map((site) => (
                <SelectItem key={site._id?.toString()} value={site._id?.toString() ?? ""}>
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


