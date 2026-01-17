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
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearHeaders, setCurrentHeader } from "@/hooks/slices/header/HeaderSlice";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { clearFooters } from "@/hooks/slices/footer/FooterSlice";
import { clearProducts } from "@/hooks/slices/product/ProductSlice";
import { clearWebsitePages } from "@/hooks/slices/website/websitePageSlice";

export const UpperBar = () => {

  const { user } = useSelector((state: RootState) => state.user)
  const { agencies, curretAgency } = useSelector((state: RootState) => state.agency)
  const { allBusiness, currentBusiness, allSelectedBusiness } = useSelector((state: RootState) => state.business)
  const { websites, currentWebsite, selectedWebsites } = useSelector((state: RootState) => state.websites)
  const dispatch = useDispatch<AppDispatch>();


  const router = useRouter()
  const pathName = usePathname()

  const searchParams = useSearchParams()
  const agencyId = searchParams.get("agencyid")
  const businessId = searchParams.get("businessid")


  useEffect(() => {
    if (agencyId &&
      agencies &&
      agencies.length > 0 &&
      businessId &&
      allBusiness &&
      allBusiness.length > 0 &&
      websites &&
      websites.length > 0
    ) {

      const currentAgency = agencies.find(a => a._id === agencyId)

      if (currentAgency) {
        dispatch(setCurretAgency(currentAgency))
        const currentBusiness = allBusiness.find(b => b._id === businessId)

        if (currentBusiness) {
          dispatch(setCurrentBusiness(currentBusiness))
        }
        const currentWebsite = websites.find(w => w.tenantId === currentBusiness?._id)

        if (currentWebsite) {
          dispatch(setCurrentWebsite(currentWebsite))
        }

      }
    }
  }, [agencyId, agencies, businessId, allBusiness, websites])



  const updatedAllBusiness = useMemo(() => {
    return allSelectedBusiness
  }, [allSelectedBusiness,])


  const updatedAllWebsites = useMemo(() => {
    return selectedWebsites
  }, [selectedWebsites])

  const updatedCurrentWebsite = useMemo(() => {
    return currentWebsite
  }, [currentWebsite])


  const handleAgencyChange = (agencyId: string) => {
     handleResetRedux()
    const agency = agencies.find(a => a._id?.toString() === agencyId);
    dispatch(setCurrentHeader(null));
    dispatch(setCurretAgency(agency || null));

    const allBus = allBusiness.filter(item => item.tenantId === agency?._id)

    if (allBus.length === 1) {
      dispatch(setSelectedBusiness(allBus))
      // dispatch(setCurrentBusiness(allBus[0]))
      const allWeb = websites.filter(item => item.tenantId === allBus[0]?._id)
      if (allWeb) {
        dispatch(setSelectedWebsite(allWeb))

        //dispatch(setCurrentWebsite(allWeb[0]))
      }

      // Update URL search params
      const primaryBusiness = allWeb[0]?.primaryDomain?.[0] ?? null

      const params = new URLSearchParams(searchParams.toString())
      params.set('agencyid', agencyId)
      params.set('businessid', allBus[0]._id?.toString() || '')

      router.push(`/admin/websites/${primaryBusiness}?${params.toString()}`)
    }
    else if (allBus.length > 1) {
      dispatch(setSelectedBusiness(allBus))
      // dispatch(setCurrentBusiness(allBus[0]))
      const allWeb = websites.filter(item => item.tenantId === allBus[0]?.tenantId)
      if (allWeb) {
        dispatch(setSelectedWebsite(allWeb))
        // dispatch(setCurrentWebsite(allWeb[0]))
      }
      const primaryBusiness = allWeb[0]?.primaryDomain?.[0] ?? null
      // Update URL search params
      const params = new URLSearchParams(searchParams.toString())
      params.set('agencyid', agencyId)
      params.set('businessid', allBus[0]._id?.toString() || '')
      router.push(`/admin/websites/${primaryBusiness}?${params.toString()}`)
    }
  }

  const handleBusinessChange = (tenantId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const business = allBusiness.find(b => b._id?.toString() === tenantId);
    params.set('businessid', business?._id?.toString() || '')
   params.set('agencyid', business?.tenantId?.toString() || '')
    dispatch(setCurrentBusiness(business || null));
    const allWeb = websites.filter(item => item.tenantId === business?._id)
    if (allWeb) {
      dispatch(setSelectedWebsite(allWeb))
      dispatch(setCurrentWebsite(allWeb[0]))
      const primaryBusiness = allWeb[0]?.primaryDomain?.[0] ?? null
      router.push(`/admin/websites/${primaryBusiness}?${params.toString()}`)
    }
  }

  const handleWebsiteChange = (websiteId: string) => {
    const website = websites.find(w => w._id?.toString() === websiteId);
    dispatch(setCurrentWebsite(website || null));
    const params = new URLSearchParams(searchParams.toString())
     const primaryBusiness = website?.primaryDomain?.[0] ?? null
     params.set('businessid', currentBusiness?._id?.toString() || '')
   params.set('agencyid', curretAgency?._id?.toString() || '')
    router.push(`/admin/websites/${primaryBusiness}?${params.toString()}`)  

  }

  const handleResetRedux=()=>{
    dispatch(clearAttributes())

      dispatch(clearBrands())
        dispatch(clearCategories())
          dispatch(clearFooters())
            dispatch(clearHeaders())
              // dispatch(clearMenus())
                dispatch(clearProducts())
                  dispatch(clearWebsitePages())
                 
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
          <SelectTrigger className="h-10 py-4 min-w-[240px] rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate font-medium">
                  {curretAgency?.name || "Select Agency"}
                </span>
              </div>
              {/* <ChevronDown className="h-4 w-4 opacity-60" /> */}
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
            <SelectTrigger className="h-10 min-w-[240px] rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">
                    {currentBusiness?.name || "Select Business"}
                  </span>
                </div>
                {/* <ChevronDown className="h-4 w-4 opacity-60" /> */}
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
            <SelectTrigger className="h-10 min-w-[260px] rounded-md border border-gray-300 bg-white px-3 focus:ring-2 focus:ring-gray-600">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium">
                    {currentWebsite?.name || "Select Website"}
                  </span>
                </div>
                {/* <ChevronDown className="h-4 w-4 opacity-60" /> */}
              </div>
            </SelectTrigger>

            <SelectContent className="w-auto">
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


