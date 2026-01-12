const   getSubtext = (type?: string) => {
  if (!type) return null;
  if (type === "franchise") return "Franchise panel";
  if (type === "agency") return "Agency panel";
  return "Business panel";
}

export default getSubtext