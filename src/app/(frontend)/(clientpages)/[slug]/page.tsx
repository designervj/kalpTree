import { auth } from "@/auth";
import { headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({ params }: any) {
  const headersList = await headers();

  const host = headersList.get("host");

  const main = await fetch(`${API_BASE_URL}/api/domain/${host}`);

  const domainData = await main.json();

  const param = await params;

  console.log(param);

  const slugs = !param.hasOwnProperty("slug") ? "home" : param.slug;

  const query = new URLSearchParams({
    id: domainData.item, // page ID
    slug: slugs, // page slug
  }).toString();

  if (!domainData.item) {
    return <>404 Not Found</>;
  }

  const session = await auth();

  console.log("session iiii===", session);

  const res = await fetch(`${API_BASE_URL}/api/pages/websites?${query}`);

  const t = await res.json();
  console.log(" tttt-->", t);
  // t is an array, get the first item
  const html =
    Array.isArray(t) && t.length > 0
      ? t.find((d) => d.slug == slugs).content
      : undefined;

  const EditButton = (await import("../EditButton")).default;
  console.log(" html-->", html);
  const name = "Himanshu";

  const processedHtml = html ? html.replace(/\{\{name\}\}/g, name) : "";
  console.log(" processedHtml-->", processedHtml);
  return (
    <div>
      {session &&
        session.user &&
        (session.user.role == "superadmin" ||
          session?.user.role == "agency" ||
          session.user.role === "business") &&
        Array.isArray(t) &&
        t.length > 0 && <EditButton pageData={t[0]} />}
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
    </div>
  );
}
