import {
  Menu,
  LayoutDashboard,
  Globe2,
  FileText,
  Type,
  Tags,
  Bell,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
  Settings2,
  CreditCard,
  Activity,
  Blocks,
  Webhook,
  Download,
  ShieldCheck,
  Users,
  Fingerprint,
  UsersRound,
  UserPlus,
  History,
  KeyRound,
  ImagePlus,
  ScanSearch,
  Paintbrush,
  Bot,
  Network,
  Compass,
  Terminal,
  Heart,
  GalleryVerticalEnd,
  Cpu,
  Image as ImageIcon,
  Megaphone,
  BookOpen,
  TicketPercent,
  MailPlus,
  Zap,
  ShoppingBag,
  BarChart4,
  ShoppingCart,
  RefreshCcw,
  ReceiptIndianRupee, // or Banknote / Percent
  Truck,
  Settings,
  Package,
  LayoutGrid,
  Award,
  Layers,
  ListTree,
  Hash,
  Component,
  Boxes,
  CircleDollarSign,
  Image,
  SwatchBook,
  BarChart3,
  HeartPulse,
  FileCode2,
  Newspaper,
  PanelTop,
  PanelBottom,
  ClipboardList,
  ArrowLeftRight,
  User,
  Sparkles,
  ChevronsUpDown,
  LogOut,
  CalendarCheck,
  Calendar,
  BedDouble,
  IndianRupee,
  ScrollText,
  LayoutGridIcon,
  TypeIcon,
  Factory,
  LanguagesIcon,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { NavSection } from "../../AppShell";

export const currenBusinessSections: NavSection[] = [
  {
    id: "dashboard-overview",
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "dashboard:update",
      },
      {
        label: "Analytics",
        href: "/admin/overview/analytics",
        icon: BarChart3,
        permission: "dashboard:update",
      },
      {
        label: "Activity Log",
        href: "/admin/overview/activity-log",
        icon: Activity,
        permission: "analytics:read",
      },
      {
        label: "Notifications",
        href: "/admin/overview/notifications",
        icon: Bell,
        permission: "security:read",
      },
      {
        label: "System Health",
        href: "/admin/overview/system-health",
        icon: HeartPulse,
        permission: "security:read",
      },
      {
        label: "Quick Actions",
        href: "/admin/overview/quick-actions",
        icon: Zap,
        permission: "security:read",
      },
    ],
  },

  {
    id: "website",
    label: "Website",
    items: [
      {
        label: "Pages",
        href: "/admin/website/pages",
        icon: FileCode2,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Posts",
        href: "/admin/website/posts",
        icon: Newspaper,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Header",
        href: "/admin/website/header",
        icon: PanelTop,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Footer",
        href: "/admin/website/footer",
        icon: PanelBottom,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Forms",
        href: "/admin/website/forms",
        icon: ClipboardList,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
      {
        label: "Redirects",
        href: "/admin/website/redirects",
        icon: ArrowLeftRight,
        permission: ["websites:update", "websites:read", "websites:delete"],
      },
    ],
  },

  {
    id: "branding",
    label: "Branding & Design",
    items: [
      {
        label: "Brand Profile",
        href: "/admin/branding/brand-profile",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Logo",
        href: "/admin/branding/logo",
        icon: Image,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Colors",
        href: "/admin/branding/colors",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Media",
        href: "/admin/website/media",
        icon: ImageIcon,
        permission: ["media:update", "media:read", "media:delete"],
      },
      {
        label: "Typography",
        href: "/admin/branding/typography",
        icon: Type,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Theme Presets",
        href: "/admin/branding/theme-presets",
        icon: SwatchBook,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "products",
    label: "Products",
    items: [
      {
        label: "Product Type",
        href: "/admin/product-type",
        icon: TypeIcon,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Variants",
        href: "/admin/variants",
        icon: Boxes,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Category",
        href: "/admin/category",
        icon: LayoutGrid,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Attribute",
        href: "/admin/attribute",
        icon: ListTree,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Business Type",
        href: "/admin/businesstype",
        icon: Component,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Tags",
        href: "/admin/tags",
        icon: Hash,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Industry Type",
        href: "/admin/industry-type",
        icon: Factory,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Pricing Rules & Discount",
        href: "/admin/pricing-rules",
        icon: CircleDollarSign,
        permission: ["product:read", "product:update", "product:delete"],
      },
    ],
  },

  {
    id: "ecommerce",
    label: "E-Commerce",
    feature: "ecommerceEnabled",
    items: [
      {
        label: "Orders",
        href: "/admin/ecommerce/orders",
        icon: ShoppingBag,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Customers",
        href: "/admin/ecommerce/customers",
        icon: Users,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Reports",
        href: "/admin/ecommerce/reports",
        icon: BarChart4,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Abandoned Carts",
        href: "/admin/ecommerce/abandoned-carts",
        icon: ShoppingCart,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Subscriptions",
        href: "/admin/ecommerce/subscriptions",
        icon: RefreshCcw,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Taxes",
        href: "/admin/ecommerce/taxes",
        icon: ReceiptIndianRupee,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Shipping",
        href: "/admin/ecommerce/shipping",
        icon: Truck,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Payments",
        href: "/admin/ecommerce/payments",
        icon: CreditCard,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Invoices",
        href: "/admin/ecommerce/invoices",
        icon: FileText,
        permission: ["product:read", "product:update", "product:delete"],
      },
      {
        label: "Settings",
        href: "/admin/ecommerce/settings",
        icon: Settings,
        permission: ["product:read", "product:update", "product:delete"],
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    feature: "bookingEnabled",
    items: [
      {
        label: "Rooms and Rent Plans",
        href: "/admin/bookings/rooms-rate-plans",
        icon: CalendarCheck,
        permission: ["booking:read"],
      },
      {
        label: "Reservations",
        href: "/admin/bookings/reservations",
        icon: CalendarCheck,
        permission: ["booking:read"],
      },
      {
        label: "Calendar / Availability",
        href: "/admin/bookings/calendar",
        icon: Calendar,
        permission: ["booking:read", "booking:update"],
      },
      {
        label: "Rooms / Units",
        href: "/admin/bookings/units",
        icon: BedDouble,
        permission: ["product:read", "product:update"],
      },
      {
        label: "Rate Plans",
        href: "/admin/bookings/rates",
        icon: IndianRupee,
        permission: ["booking:update"],
      },
      {
        label: "Guests",
        href: "/admin/bookings/guests",
        icon: Users,
        permission: ["booking:read"],
      },
      {
        label: "Reports",
        href: "/admin/bookings/reports",
        icon: BarChart4,
        permission: ["booking:read"],
      },
      {
        label: "Policies",
        href: "/admin/bookings/policies",
        icon: ScrollText,
        permission: ["booking:update"],
      },
      {
        label: "Settings",
        href: "/admin/bookings/settings",
        icon: Settings,
        permission: ["booking:update"],
      },
    ],
  },

  {
    id: "appointments",
    label: "Appointments",
    feature: "appointmentsEnabled", // ← entire section hidden if appointmentsEnabled is false
    items: [
      {
        label: "All Appointments",
        href: "/admin/appointments",
        icon: CalendarCheck,
        permission: ["booking:read"],
      },
      {
        label: "Calendar",
        href: "/admin/appointments/calendar",
        icon: Calendar,
        permission: ["booking:read", "booking:update"],
      },
      {
        label: "Services",
        href: "/admin/appointments/services",
        icon: Package,
        permission: ["booking:read", "booking:update"],
      },
      {
        label: "Staff",
        href: "/admin/appointments/staff",
        icon: Users,
        permission: ["booking:read", "booking:update"],
      },
      {
        label: "Clients",
        href: "/admin/appointments/clients",
        icon: Users,
        permission: ["booking:read"],
      },
      {
        label: "Settings",
        href: "/admin/appointments/settings",
        icon: Settings,
        permission: ["booking:update"],
      },
    ],
  },

  {
    id: "events",
    label: "Events",
    feature: "eventsEnabled", // ← entire section hidden if eventsEnabled is false
    items: [
      {
        label: "All Events",
        href: "/admin/events",
        icon: CalendarCheck,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Calendar",
        href: "/admin/events/calendar",
        icon: Calendar,
        permission: ["content:read", "content:update"],
      },
      {
        label: "Tickets",
        href: "/admin/events/tickets",
        icon: TicketPercent,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Attendees",
        href: "/admin/events/attendees",
        icon: Users,
        permission: ["content:read"],
      },
      {
        label: "Reports",
        href: "/admin/events/reports",
        icon: BarChart4,
        permission: ["content:read"],
      },
      {
        label: "Settings",
        href: "/admin/events/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "membership",
    label: "Membership",
    feature: "membershipEnabled", // ← entire section hidden if membershipEnabled is false
    items: [
      {
        label: "Members",
        href: "/admin/membership/members",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Plans",
        href: "/admin/membership/plans",
        icon: Package,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Benefits",
        href: "/admin/membership/benefits",
        icon: Award,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Reports",
        href: "/admin/membership/reports",
        icon: BarChart4,
        permission: ["content:read"],
      },
      {
        label: "Settings",
        href: "/admin/membership/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "donations",
    label: "Donations",
    feature: "donationsEnabled", // ← entire section hidden if donationsEnabled is false
    items: [
      {
        label: "All Donations",
        href: "/admin/donations",
        icon: CircleDollarSign,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Campaigns",
        href: "/admin/donations/campaigns",
        icon: Megaphone,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Donors",
        href: "/admin/donations/donors",
        icon: Users,
        permission: ["content:read"],
      },
      {
        label: "Reports",
        href: "/admin/donations/reports",
        icon: BarChart4,
        permission: ["content:read"],
      },
      {
        label: "Settings",
        href: "/admin/donations/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "portfolio",
    label: "Portfolio",
    feature: "portfolioEnabled", // ← entire section hidden if portfolioEnabled is false
    items: [
      {
        label: "Projects",
        href: "/admin/portfolio/projects",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Categories",
        href: "/admin/portfolio/categories",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Media",
        href: "/admin/portfolio/media",
        icon: ImageIcon,
        permission: ["media:read", "media:update", "media:delete"],
      },
      {
        label: "Settings",
        href: "/admin/portfolio/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "testimonials",
    label: "Testimonials",
    feature: "testimonialsEnabled", // ← entire section hidden if testimonialsEnabled is false
    items: [
      {
        label: "All Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquare,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Pending Review",
        href: "/admin/testimonials/pending",
        icon: ClipboardList,
        permission: ["content:read", "content:update"],
      },
      {
        label: "Settings",
        href: "/admin/testimonials/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "faq",
    label: "FAQ",
    feature: "faqEnabled", // ← entire section hidden if faqEnabled is false
    items: [
      {
        label: "All FAQs",
        href: "/admin/faq",
        icon: HelpCircle,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Categories",
        href: "/admin/faq/categories",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Settings",
        href: "/admin/faq/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "team",
    label: "Team",
    feature: "teamEnabled", // ← entire section hidden if teamEnabled is false
    items: [
      {
        label: "Members",
        href: "/admin/team/members",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Departments",
        href: "/admin/team/departments",
        icon: UsersRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Roles",
        href: "/admin/team/roles",
        icon: Fingerprint,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Settings",
        href: "/admin/team/settings",
        icon: Settings,
        permission: ["content:update"],
      },
    ],
  },

  {
    id: "marketing",
    label: "Marketing",
    items: [
      {
        label: "Proposal",
        href: "/admin/marketing/proposal",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Banners",
        href: "/admin/marketing/banners",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Campaigns",
        href: "/admin/marketing/campaigns",
        icon: Megaphone,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Catalog Generation",
        href: "/admin/marketing/catalog-generation",
        icon: BookOpen,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Quotations",
        href: "/admin/marketing/quotations",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Coupons",
        href: "/admin/marketing/coupons",
        icon: TicketPercent,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Email Templates",
        href: "/admin/marketing/email-templates",
        icon: MailPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/marketing/integrations",
        icon: Share2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Automation Rules",
        href: "/admin/marketing/automation-rules",
        icon: Zap,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "users",
    label: "Users",
    items: [
      {
        label: "All Users",
        href: "/admin/users/all-user",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Create Users",
        href: "/admin/users/create",
        icon: UserPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Roles & Permissions",
        href: "/admin/users/roles-permissions",
        icon: Fingerprint,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Teams",
        href: "/admin/users/teams",
        icon: UsersRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Activity Logs",
        href: "/admin/users/activity-logs",
        icon: History,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "API Access",
        href: "/admin/users/api-access",
        icon: KeyRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "settings",
    label: "Settings",
    items: [
      {
        label: "General",
        href: "/admin/settings/general",
        icon: Settings2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Domain & DNS",
        href: "/admin/settings/domain-dns",
        icon: Globe,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Billing & Plans",
        href: "/admin/settings/billing-plans",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Language Manager",
        href: "/admin/settings/language",
        icon: LanguagesIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Usage & Limits",
        href: "/admin/settings/usage-limits",
        icon: Activity,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Webhooks",
        href: "/admin/settings/webhooks",
        icon: Webhook,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Data Export",
        href: "/admin/settings/data-export",
        icon: Download,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Security",
        href: "/admin/settings/security",
        icon: ShieldCheck,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "block-manager",
    label: "Templates Manager",
    items: [
      {
        label: "Templates",
        href: "/admin/website/templates",
        icon: Blocks,
        permission: ["media:update", "media:read", "media:delete"],
      },
      {
        label: "All Components",
        href: "/admin/website/all-components",
        icon: Blocks,
        permission: ["media:update", "media:read", "media:delete"],
      },
    ],
  },
];
