import { Users } from "lucide-react";

const   BusinessIcon=({
  tone = "blue",
}: {
  tone?: "blue" | "dark" | "purple";
}) => {
  const bg =
    tone === "purple"
      ? "bg-purple-600"
      : tone === "dark"
      ? "bg-slate-900"
      : "bg-[#0b6d8e]";
  return (
    <div
      className={`h-14 w-14 rounded-md ${bg} grid place-items-center text-white font-bold`}>
      <Users className="h-6 w-6" />
    </div>
  );
}

export default BusinessIcon