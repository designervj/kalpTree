

export default async function WebsiteIndexPage(props: any) {
  const params = await props.params;
  const { website } = params as { website: string };

  return (
    <div className="mx-auto max-w-full px-6">
      <div className="flex items-center justify-between mb-6">himanshu</div>
    </div>
  );
}
