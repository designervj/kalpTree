import PageTemplate from "./[slug]/page";
import ProductCategoryPage from "./product-category/page";
import SingleProductPage from "./product/[slug]/page";
// Update with actual path

export default async function LangHomePage({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "";


  // Check if lang length > 2 and is 'product' or 'product-category'
  if (lang.length > 2 && lang === "product-category") {
    return <ProductCategoryPage params={params} />;
  } else if (lang.length > 2 && lang === "product") {
    return <SingleProductPage params={params} />;
  }

  return <PageTemplate params={params} />;
}
