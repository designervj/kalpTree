import {
  Megaphone,
  HardHat,
  Briefcase,
  Hammer,
  Sofa,
  Cpu,
  Landmark,
  Home,
  Armchair,
  Factory,
  ShoppingBag,
  Shirt,
  Sparkles,
  HeartPulse,
  HelpCircle,
  LucideIcon
} from "lucide-react";

export const IndustryIconMap: Record<string, LucideIcon> = {
  marketing: Megaphone,
  construction: HardHat,
  consulting: Briefcase,
  "home-improvement": Hammer,
  "interior-design": Sofa,
  technology: Cpu,
  architecture: Landmark,
  "real-estate": Home,
  "furniture-and-home-furnishing": Armchair,
  manufacturing: Factory,
  retail: ShoppingBag,
  "hospitality-tourism": Briefcase,
  "apparel-and-clothing": Shirt,
  "beauty-and-fitness": Sparkles,
  "healthcare-and-medical-services": HeartPulse,
};

// ✅ Default fallback icon
export const DEFAULT_INDUSTRY_ICON: LucideIcon = HelpCircle;

// ✅ Safe Getter Function
export const getIndustryIcon = (slug?: string): LucideIcon => {
  if (!slug) return DEFAULT_INDUSTRY_ICON;
  return IndustryIconMap[slug] || DEFAULT_INDUSTRY_ICON;
};