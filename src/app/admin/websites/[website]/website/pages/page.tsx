import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import WebsitePageHome from "@/components/admin/website/websitePage/WebsitePageHome";
import { websiteTenantService } from "@/lib/websites/website-service";


export default async function PagesAdmin() {
  const session = await auth();
  const user = session?.user.id;
  const role = session?.user.role;
  const tenant = await websiteTenantService.listByUserId(user!, role);
  const tenantId = String(tenant[0]?._id);

  if (!tenantId) {
    return (
      <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
    );
  }

  return (
    <>
      <WebsitePageHome />
    </>
  );
}
