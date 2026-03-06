import { PackageForm } from "@/components/admin/Packages/components/PackageForm";
import { emptyPkg } from "@/components/admin/Packages/PackagePanel";

export default function PackageHome() {
  return <PackageForm mode="create" />;
}
