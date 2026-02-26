import { auth } from "@/auth";
import GetAllAccount from "@/components/admin/accounts/GetAllAccount";

import GetBusinessUsers from "@/components/admin/users/GetBusinessUsers";
import { UserForm } from "@/components/admin/users/UserForm";
import { TenantModel } from "@/hooks/slices/user/accountSlice";
import { cookies } from "next/headers";
const isSessionExpired = (expires: string) => {
  return new Date() > new Date(expires);
};
export default async function Page() {
  const session = await auth();
  let allaccounts: TenantModel[] = [];

  const cookie = await cookies();

  let tenantId =
    session?.user.role == "superadmin"
      ? cookie.get("current_selected_agency_id")?.value
      : session?.user.tenantId;

  if (!session?.user?.tenantId) {
    return (
      <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
    );
  }

  if (session?.expires && session.user.role == "superadmin") {
    if (!isSessionExpired(session?.expires)) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:55803";
      const url = `${baseUrl.replace(
        /\/$/,
        ""
      )}/api/admin/users/accounts?tenantId=${tenantId}`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        allaccounts = data.tenants || [];
        console.log("allaccounts", allaccounts);
      } else {
        console.error("Failed to fetch tenants", res.status, await res.text());
      }
    } else {
      // Session expired: handle accordingly (e.g., redirect, show message)
    }
  }

  return (
    <div>
      <UserForm />
 
      <GetAllAccount allaccounts={allaccounts || []} />
      {/* <GetAllRolePermission /> */}
      <GetBusinessUsers />
    </div>
  );
}
