const ROLE_MAP = {
  superadmin: "",
  agency: "",
  business: "",
} as const;

type Role = keyof typeof ROLE_MAP;

export function toCreateHref(
  url: string,
  businessId: string | null = null,
  agencyid: string | null = null,
  role: string
) {
  console.log(role);
  if (!(role in ROLE_MAP)) {
    throw new Error("Invalid role");
  }
  const obj: Record<Role, string> = {
    superadmin: `/admin/websites/${url}?businessid=${businessId}&agencyid=${agencyid}`,
    agency: `/admin/websites/${url}?businessid=${businessId}&agencyid=${agencyid}`,
    business: `/admin/websites/${url}`,
  };

  return obj[role as Role];
}
