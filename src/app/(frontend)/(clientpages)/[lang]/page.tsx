import PageTemplate from "./[slug]/page";

export default async function LangHomePage({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;
}) {
  return <PageTemplate params={params} />;
}
