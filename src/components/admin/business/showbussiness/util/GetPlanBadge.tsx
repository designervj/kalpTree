
"use client"
import { BadgeCheck, Crown, Sparkles } from "lucide-react";
import Badge from "./Badge";

const GetPlanBadge = ({ plan }: { plan: string }) => {
  const normalizedPlan = plan.toLowerCase();
  if (normalizedPlan === "agency") {
    return (
      <Badge variant="purple">
        <Crown className="mr-1 h-3.5 w-3.5" />
        Agency
      </Badge>
    );
  } else if (normalizedPlan === "pro") {
    return (
      <Badge variant="green">
        <BadgeCheck className="mr-1 h-3.5 w-3.5" />
        Pro
      </Badge>
    );
  } else if (normalizedPlan === "trial") {
    return (
      <Badge variant="amber">
        <Sparkles className="mr-1 h-3.5 w-3.5" />
        Trial
      </Badge>
    );
  } else {
    return <Badge>Free</Badge>;
  }
}

export default GetPlanBadge