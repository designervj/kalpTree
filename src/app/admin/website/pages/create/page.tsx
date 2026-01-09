import { cookies as cookiesFn, headers as headersFn } from "next/headers";
import PageCreator, { FieldConfig } from "@/components/admin/Creator";
import { auth } from "@/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default async function NewPage() {
  const session = await auth();
  console.log(session?.user);
  const cookies = await cookiesFn();

  // const currentWebsiteId = cookies.get("current_website_id")?.value;
  // const currentTenantId = cookies.get("current_selected_tenant_id")?.value;

 
  // Default/empty item for new page
  const emptyItem = {
    title: "",
    content: "",
    slug: "",
    status: "draft",
    tenantId: "",
    websiteId: "",
  };

  const fieldConfig: FieldConfig[] = [
    // Left side (8/12 width) - Main content
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

    // Right side (4/12 width) - Metadata
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
    },
    {
      name: "websiteId",
      label: "Website",
      type: "text",
      side: "right",
      placeholder: "website-id",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Create New Page</h2>
      <PageCreator item={emptyItem} fields={fieldConfig} />
    </div>
  );
}
