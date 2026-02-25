"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "../../DataTableExt";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { deleteWebsitePage } from "@/hooks/slices/website/WebsitePageThunk";
import { WebsitePageModel } from "./WebsitePageType";
import { buildWebsiteHref } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateCurrentPage } from "@/hooks/slices/website/websitePageSlice";

const WebsitePageTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());

  const filteredPages = useMemo(() => {
    if (
      currentBusiness &&
      currentBusiness._id &&
      websitePages &&
      websitePages.length > 0
    ) {
      const list = websitePages.filter(
        (item) => item.tenantId === currentBusiness._id,
      );
      return list.length > 0 ? list : websitePages;
    }
    return [];
  }, [currentBusiness, websitePages]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    console.log("iiiiiii", id);
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }
    const ok = confirm(`Delete page "${row?.title ?? id}"?`);
    if (!ok) return;

    dispatch(deleteWebsitePage(id));
  };

  const handleView = (row: WebsitePageModel) => {
    const id = row?._id;
    if (!id) return;

    dispatch(updateCurrentPage(row));
    const createHref = buildWebsiteHref(
      `/admin/website/pages/${id}`,
      params.website!,
      searchparams,
    );
    router.push(createHref);
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "slug", label: "Slug" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "publishedAt", label: "Published" },
    { key: "createdAt", label: "Created" },
  ];

  const handleViewTab = async (row: WebsitePageModel) => {
    if (!currentBusiness?.website?.primaryDomain) {
      return;
    }
    const isLocalHost = window.location.hostname.includes("localhost");

    if (isLocalHost) {
      const url = `http://${currentBusiness?.website?.primaryDomain[1]}/builder/${currentBusiness?._id}?page=${row.slug}`;

      window.open(url, "_blank");
    } else {
      const url = `http://${currentBusiness?.website?.primaryDomain[0]}/builder/${currentBusiness?._id}?page=${row.slug}`;

      window.open(url, "_blank");
    }
  };

  const createHref = buildWebsiteHref(
    "/admin/website/pages/create",
    params.website!,
    searchparams,
  );

  const handleWebsiteBuilder = () => {
    const url = `/builder/${currentBusiness?._id}`;
    window.open(url, "_blank");
  };

  return (
    <>
    
      {/* <Button onClick={handleWebsiteBuilder} className="mb-4">
        Website Builder
      </Button> */}
      <div>
        <DataTableExt
          title="Pages"
          data={filteredPages}
          createHref={createHref}
          initialColumns={initialColumns}
          onDelete={handleDelete}
          onView={handleView}
          opentab={handleViewTab}
        />
      </div>
    </>
  );
};

export default WebsitePageTable;
