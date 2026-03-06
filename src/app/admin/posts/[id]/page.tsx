import { cookies as cookiesFn, headers as headersFn } from 'next/headers';
import Editor from './Editor';
import PageEditor, { FieldConfig } from '@/components/admin/Editor';


export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const param = await params
  const cookies = await cookiesFn();
  const headers = await headersFn();
  const cookie = cookies.toString();
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/posts/${param.id}`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;
  const { item } = await res.json();



  const fieldConfig: FieldConfig[] = [
    // Readonly fields (shown at top)
    { name: "slug", label: "Slug", type: "readonly", side: "NA" },
    { name: "createdAt", label: "CreatedAt", type: "readonly", side: "NA" },
    { name: "updatedAt", label: "UpdatedAt", type: "readonly", side: "NA" },
    { name: "publishedAt", label: "PublishedAt", type: "readonly", side: "NA" },

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
      placeholder: "post-slug",
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
      name: "author",
      label: "Author",
      type: "text",
      side: "right",
      placeholder: "author",
      nestedKey: "userId"
    },
    {
      name: "categoryId",
      label: "Category",
      type: "text",
      side: "right",
      placeholder: "categoryId",
    },
    {
      name: "tenantId",
      label: "Tenant",
      type: "text",
      side: "right",
      placeholder: "tenantId",
    },
    {
      name: "excerpt",
      label: "Excerpt",
      type: "text",
      side: "left",
      placeholder: "Excerpt",
    },
    {
      name: "tags",
      label: "Tag",
      type: "array",
      side: "left",
      placeholder: "Tags",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Post</h2>

      <PageEditor apiEndpoint={"/api/posts"} id={param.id} item={item} fields={fieldConfig} />
    </div>
  );
}
