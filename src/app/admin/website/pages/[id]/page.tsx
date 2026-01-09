
"use client";
import { useEffect, useMemo, useState } from "react";
import PageEditor, { FieldConfig } from "@/components/admin/Editor";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";

import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";


export default function PageDetail() {
  const params = useParams();
  const pageId = params?.id as string;
  const {user} = useSelector((state: RootState) => state.user);
const {currentpage} = useSelector((state: RootState) => state.websitePage);
  const [item, setItem] = useState<WebsitePageModel | null>(null);
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      currentpage &&
      (currentpage as WebsitePageModel).tenantId &&
      user && user.tenantId
    ) {
      setItem(currentpage as WebsitePageModel);
    }
  }, [currentpage, user]);

  const fieldConfig: FieldConfig[] = useMemo(() => [
    { name: "slug", label: "Slug", type: "readonly", side: "NA" },
    { name: "createdAt", label: "CreatedAt", type: "readonly", side: "NA" },
    { name: "updatedAt", label: "UpdatedAt", type: "readonly", side: "NA" },
    {
      name: "title",
      label: "Title",
      type: "text",
      side: "left",
      placeholder: "Enter page title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      side: "left",
      rows: 10,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      side: "right",
      placeholder: "page-slug",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      side: "right",
      options: [
        { value: "draft", label: "draft" },
        { value: "published", label: "published" },
      ],
    },
    {
      name: "tenantId",
      label: "Tenant",
      type: "text",
      side: "right",
      placeholder: "tenant-id",
      readOnly: true,
    },
    {
      name: "websiteId",
      label: "Website",
      type: "text",
      side: "right",
      placeholder: "website-id",
      readOnly: true,
    },
  ], []);

  if (!user?.tenantId) {
    return <div className="text-sm text-red-600">Unauthorized: Please sign in</div>;
  }

  

  if (!item) {
    return <div className="text-sm text-red-600">Page not found</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Page</h2>
      <PageEditor
        viewUrl={website}
        id={pageId}
        item={item}
        fields={fieldConfig}
      />
    </div>
  );
}
