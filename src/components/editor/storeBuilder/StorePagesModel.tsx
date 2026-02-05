"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Search,
  Home,
  Download,
  Tag,
  Calendar,
  Percent,
  Users,
  BarChart3,
  Settings,
  Boxes,
  Sparkles,
  MoreHorizontal,
  ArrowLeft,
  Info,
  LayoutGrid, // ✅ added (for Product pages row)
} from "lucide-react";

import OverviewPage from "./OverviewPage";
import AppointmentsPage from "../appointments/AppointmentsPage";
import StoreDetails from "../storeSetting/StoreDetails";
import CompanyInformation from "../storeSetting/CompanyInformation";
import Payments from "../storeSetting/Payments";
import Shipping from "../storeSetting/Shipping";
import Checkout from "../storeSetting/Checkout";
import Emails from "../storeSetting/Emails";
import Taxes from "../storeSetting/Taxes";
import Invoices from "../storeSetting/Invoices";
import ProductCategoryPage from "./ProductCategoryPage";
import ProductReviews from "./ProductReviews";
import { AddProduct } from "./AddProduct";
import { IoClose } from "react-icons/io5";
import Analytics from "./Analytics";
import GetAllAttribute from "@/components/admin/attribute/attributeList/GetAllAttribute";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";
import GetAllBrand from "@/components/admin/brand/brandList/GetAllBrand";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { CSVImportModal } from "@/components/admin/product/ImportCSV";

type SetupItem = { id: string; label: string; done?: boolean };
type NavChild = { id: string; label: string };
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: NavChild[];
};

type ProductRow = {
  id: string;
  name: string;
  price: string;
  variants: string;
  inventory: string;
  sku: string;
  status: "Active" | "Draft";
};

const SETUP: SetupItem[] = [
  { id: "shipping", label: "Update shipping options", done: true },
  { id: "add-product", label: "Add a product", done: true },
  { id: "payment", label: "Add a payment method", done: false },
  { id: "company", label: "Update company details", done: false },
];

const PRODUCTS_GROUP_CHILD_IDS = [
  "products",
  "categories",
  "product-reviews",
] as const;
const SETTINGS_GROUP_CHILD_IDS = [
  "store-details",
  "company-information",
  "payments",
  "shipping",
  "checkout",
  "emails",
  "taxes",
  "invoices",
] as const;

const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: <Home className="h-4 w-4" /> },
  { id: "orders", label: "Orders", icon: <Download className="h-4 w-4" /> },
  {
    id: "products-group",
    label: "Products",
    icon: <Tag className="h-4 w-4" />,
    children: [
      { id: "products", label: "Product list" },
      { id: "categories", label: "Categories" },
      { id: "product-reviews", label: "Product reviews" },
    ],
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: "discounts",
    label: "Discounts",
    icon: <Percent className="h-4 w-4" />,
  },
  { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "settings-group",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { id: "store-details", label: "Store Details" },
      { id: "company-information", label: "Company information" },
      { id: "payments", label: "Payments" },
      { id: "shipping", label: "Shipping" },
      { id: "checkout", label: "Checkout" },
      { id: "emails", label: "Emails" },
      { id: "taxes", label: "Taxes" },
      { id: "invoices", label: "Invoices" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Boxes className="h-4 w-4" />,
  },
];

const PRODUCTS: ProductRow[] = [
  {
    id: "p1",
    name: "Original Flavor Roasted Peanuts Pack",
    price: "$22.99",
    variants: "—",
    inventory: "In stock",
    sku: "sgsdg",
    status: "Active",
  },
  {
    id: "p2",
    name: "“Binocular” Vase",
    price: "$49.99",
    variants: "—",
    inventory: "In stock",
    sku: "—",
    status: "Active",
  },
  {
    id: "p3",
    name: "Minimal Ceramic Planter",
    price: "$18.00",
    variants: "2",
    inventory: "In stock",
    sku: "PLN-18",
    status: "Active",
  },
];

function DoneDot({ done }: { done?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
        done
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-slate-300 bg-white text-transparent dark:border-slate-700 dark:bg-transparent",
      )}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        className={done ? "opacity-100" : "opacity-0"}
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SidebarNav({
  active,
  setActive,
}: {
  active: string;
  setActive: (id: string) => void;
}) {
  const [productsOpen, setProductsOpen] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // ✅ AUTO OPEN GROUPS WHEN ACTIVE IS INSIDE THEM (so "jump" always shows left menu expanded)
  React.useEffect(() => {
    if ((PRODUCTS_GROUP_CHILD_IDS as readonly string[]).includes(active))
      setProductsOpen(true);
    if ((SETTINGS_GROUP_CHILD_IDS as readonly string[]).includes(active))
      setSettingsOpen(true);
  }, [active]);

  const isGroupActive = (groupId: string, children?: NavChild[]) => {
    if (!children?.length) return active === groupId;
    return children.some((c) => c.id === active) || active === groupId;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Setup card */}
      <div className="mx-2 mb-2 rounded-2xl border border-violet-200/60 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </span>

            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Store setup{" "}
              <span className="font-medium text-slate-500 dark:text-slate-300">
                (2/4)
              </span>
            </div>
          </div>

          <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-white text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-200">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>

        <Button
          variant="outline"
          className={cn(
            "mt-3 h-10 w-full justify-start rounded-sm",
            "border-violet-200 bg-white text-violet-700 hover:bg-slate-50",
            "dark:border-violet-500/25 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5",
          )}
          onClick={() => setActive("store-setup")}
        >
          Add payment method
        </Button>
      </div>
      <hr />

      {/* Nav */}
      <div className="mt-4 max-h-[50vh] space-y-1 overflow-y-auto px-2">
        {NAV.map((item) => {
          const hasChildren = !!item.children?.length;
          const activeGroup = isGroupActive(item.id, item.children);

          const chevron =
            item.id === "products-group"
              ? productsOpen
                ? ChevronUp
                : ChevronDown
              : item.id === "settings-group"
                ? settingsOpen
                  ? ChevronUp
                  : ChevronDown
                : null;

          const onClick = () => {
            if (item.id === "products-group") {
              setProductsOpen((v) => !v);
              setActive("products");
              return;
            }
            if (item.id === "settings-group") {
              setSettingsOpen((v) => !v);
              setActive("settings");
              return;
            }
            setActive(item.id);
          };

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={onClick}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left transition-colors",
                  activeGroup
                    ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-slate-500 dark:text-slate-300",
                      activeGroup && "text-violet-700 dark:text-violet-200",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>

                {hasChildren && chevron ? (
                  React.createElement(chevron, {
                    className: cn(
                      "h-4 w-4 text-slate-400 dark:text-slate-500",
                      activeGroup && "text-violet-600 dark:text-violet-200",
                    ),
                  })
                ) : (
                  <span className="opacity-0">.</span>
                )}
              </button>

              {/* children */}
              {item.id === "products-group" &&
              productsOpen &&
              item.children?.length ? (
                <div className="mt-1 space-y-1 pl-9">
                  {item.children.map((c) => {
                    const isActive = active === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={cn(
                          "flex w-full items-center rounded-sm px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5",
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {item.id === "settings-group" &&
              settingsOpen &&
              item.children?.length ? (
                <div className="mt-1 space-y-1 pl-9">
                  {item.children.map((c) => {
                    const isActive = active === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={cn(
                          "flex w-full items-center rounded-sm px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5",
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-2">
        <Separator className="bg-slate-200 dark:bg-slate-800" />
        <button
          type="button"
          className={cn(
            "mt-3 flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left ",
            "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5",
          )}
        >
          <span className="text-slate-400 dark:text-slate-500">
            <ChevronRight className="h-4 w-4" />
          </span>
          <span className="text-sm">Help and resources</span>
        </button>
      </div>

      <div className="mt-auto px-2 pt-4">
        <Separator className="bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3 rounded-sm px-3 py-2.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-slate-300 dark:border-slate-700" />
            Feedback
          </div>
          <div className="flex items-center gap-3 rounded-sm px-3 py-2.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700">
              ?
            </span>
            Help and resources
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Pages (Right side) -------------------- */

function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const { user } = useSelector((state: RootState) => state.user);
  const handleImport = async (data: any) => {
    try {
      const res = await fetch(
        `/api/admin/product/bulk?websiteId=${currentWebsite?._id}&tenantId=${currentWebsite?.tenantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Product has been Created");
        return true;
      } else {
        toast.error("Error in Product Creation");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <CSVImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Products{" "}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              (10 products)
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
          >
            Import products
          </Button>
          <AddProduct />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-full rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectItem value="all">Select category</SelectItem>
              <SelectItem value="decor">Decor</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Product
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 w-full rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent className="rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectItem value="all">Select filter</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Sort by
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="h-11 w-full rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
              <SelectItem value="newest">Created: Newest first</SelectItem>
              <SelectItem value="oldest">Created: Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            &nbsp;
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-11 rounded-sm border-slate-200 bg-white pl-9 dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="Search for product"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
        <UITableHeader className="w-[100%] border-b border-gray-900 bg-white dark:bg-[#0b1220]">
          <TableRow className="border-b border-gray-600">
            <TableHead className="w-[48px]">
              <div className="flex justify-center">
                <Checkbox />
              </div>
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </UITableHeader>

        <TableBody className="w-[100%]">
          {PRODUCTS.map((p) => (
            <TableRow
              key={p.id}
              className="w-[100%] hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <TableCell className="w-[48px]">
                <div className="flex justify-center">
                  <Checkbox />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-slate-800" />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {p.name}
                  </div>
                </div>
              </TableCell>

              <TableCell className="w-[100px] text-sm text-slate-700 dark:text-slate-200">
                {p.price}
              </TableCell>
              <TableCell className="w-[100px] text-sm text-slate-700 dark:text-slate-200">
                {p.variants}
              </TableCell>
              <TableCell className="w-[100px] text-sm text-slate-700 dark:text-slate-200">
                {p.inventory}
              </TableCell>
              <TableCell className="w-[100px] text-sm text-slate-700 dark:text-slate-200">
                {p.sku}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 text-xs",
                    p.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                      : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200",
                  )}
                >
                  {p.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right text-slate-400 dark:text-slate-500">
                <button
                  type="button"
                  className={cn(
                    "rounded-lg px-2 py-1 hover:bg-slate-100",
                    "dark:hover:bg-white/5",
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </div>
    </div>
  );
}

function CategoriesPage() {
  return <ProductCategoryPage />;
}

function AnalyticsPage() {
  return <Analytics />;
}

function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-violet-50 p-6 dark:border-violet-500/20 dark:bg-violet-500/10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Email marketing with Hostinger Reach
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Connect with your subscribers and grow your brand by sending
              newsletters.
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button className="rounded-sm bg-violet-600 text-white hover:bg-violet-600/90">
                Get started
              </Button>
              <Button
                variant="ghost"
                className="rounded-sm text-violet-700 hover:bg-white/60 dark:text-violet-200 dark:hover:bg-white/5"
              >
                Learn more <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="hidden h-[120px] w-[260px] rounded-2xl bg-white/70 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-slate-800 md:block" />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            Customers
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            A list of all customers who have made purchases from your store.
          </div>
        </div>

        <Button
          variant="outline"
          disabled
          className="h-11 rounded-sm border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0b1220]"
        >
          Export to CSV
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-300/60 bg-violet-50 px-5 py-4 dark:border-violet-500/25 dark:bg-violet-500/10">
        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-violet-700 ring-1 ring-violet-200 dark:bg-white/5 dark:text-violet-200 dark:ring-violet-500/25">
            <Info className="h-4 w-4" />
          </span>
          Start growing your email list by collecting marketing consent at
          checkout.
        </div>

        <div className="flex items-center gap-3">
          <Button className="rounded-sm bg-violet-600 text-white hover:bg-violet-600/90">
            Go to checkout settings
          </Button>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-400">
        No customers yet — your first ones will appear here after you make a
        sale.
      </div>
    </div>
  );
}

function DiscountsPage() {
  const [type, setType] = React.useState<"percentage" | "fixed">("percentage");

  return (
    <div className="space-y-6 pb-24">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discounts
      </button>

      <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
        Add discount
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Discount type
        </div>

        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setType("percentage")}
            className={cn(
              "flex items-center gap-2 rounded-sm border px-4 py-3 text-sm",
              type === "percentage"
                ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-200",
            )}
          >
            <Sparkles className="h-4 w-4" /> Percentage
          </button>

          <button
            type="button"
            onClick={() => setType("fixed")}
            className={cn(
              "flex items-center gap-2 rounded-sm border px-4 py-3 text-sm",
              type === "fixed"
                ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-200",
            )}
          >
            <Tag className="h-4 w-4" /> Fixed amount
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              * Discount code
            </div>
            <Input
              className="mt-2 h-11 rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="e.g., BLACKFRIDAY50"
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Discount name
            </div>
            <Input
              className="mt-2 h-11 rounded-sm border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="e.g., Black Friday Campaign"
            />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your customers won't see the discount name.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ NEW: clickable row component like your snippet */
function JumpRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-sm px-2 text-left",
        "hover:bg-slate-50 dark:hover:bg-white/5",
      )}
    >
      <div className="flex items-center gap-3 py-3">
        <div className="grid w-7 place-items-center text-slate-700 dark:text-slate-200">
          {icon}
        </div>
        <div className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {label}
        </div>
        <ChevronRight className="h-4 w-4 text-slate-400" />
      </div>
    </button>
  );
}

function StoreSetupPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            Set up your store
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Complete these steps to finish setting up your store.
          </div>
        </div>

        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-slate-900 ring-4 ring-emerald-100 dark:bg-emerald-500/10 dark:text-slate-100 dark:ring-emerald-500/15">
          2/4
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <DoneDot done />
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Add your first product
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-start gap-5">
            <div className="h-[110px] w-[140px] rounded-sm bg-violet-100/60 dark:bg-violet-500/10" />
            <div className="flex-1">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Connect a payment provider to receive orders
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                To accept and let your customers pay, add at least one payment
                method.
              </div>
            </div>
            <Button className="mt-6 h-11 rounded-sm bg-violet-600 text-white hover:bg-violet-600/90">
              Add payments
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Update company information
          </div>
          <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800">
          <DoneDot done />
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Review and setup your shipping
          </div>
        </div>
      </div>

      {/* ✅ THIS SECTION: click Product pages -> jump to Products list */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-[#0b1220]">
        <JumpRow
          icon={<LayoutGrid className="h-4 w-4" />}
          label="Product pages"
          onClick={() => onNavigate("products")} // ✅ jump
        />
        <Separator className="bg-slate-200 dark:bg-slate-800" />
        <JumpRow
          icon={<Tag className="h-4 w-4" />}
          label="Categories"
          onClick={() => onNavigate("categories")}
        />
        <Separator className="bg-slate-200 dark:bg-slate-800" />
        <JumpRow
          icon={<BarChart3 className="h-4 w-4" />}
          label="Analytics"
          onClick={() => onNavigate("analytics")}
        />
      </div>
    </div>
  );
}

function SimplePage({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0b1220]">
      <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Page UI placeholder (wireframe) — replace with your real content.
      </div>
      <div className="mt-6 h-[260px] rounded-sm bg-slate-50 dark:bg-white/5" />
    </div>
  );
}

function RightContent({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  if (active === "products") return <ProductsPage />;
  if (active === "integrations") return <SimplePage title="Integrations" />;
  if (active === "analytics") return <AnalyticsPage />;
  if (active === "customers") return <CustomersPage />;
  if (active === "discounts") return <DiscountsPage />;
  if (active === "appointments") return <AppointmentsPage />;
  if (active === "categories") return <CategoriesPage />;
  if (active === "store-setup")
    return <StoreSetupPage onNavigate={onNavigate} />; // ✅ pass down

  if (active === "product-reviews") return <ProductReviews />;
  if (active === "overview") return <OverviewPage />;
  if (active === "orders") return <SimplePage title="Orders" />;
  if (active === "settings") return <SimplePage title="Settings" />;

  if (active === "store-details") return <StoreDetails />;
  if (active === "company-information") return <CompanyInformation />;
  if (active === "payments") return <Payments />;
  if (active === "shipping") return <Shipping />;
  if (active === "checkout") return <Checkout />;
  if (active === "emails") return <Emails />;
  if (active === "taxes") return <Taxes />;
  if (active === "invoices") return <Invoices />;

  return <ProductsPage />;
}

/* -------------------- Main Component -------------------- */

export default function StorePage() {
  const [open, setOpen] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState<string>("products");

  // ✅ one navigation function for everything (sidebar + inner page jumps)
  const onNavigate = React.useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span
            className="me-auto flex justify-end"
            onClick={() => setOpen(true)}
          >
            <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </span>
        </DialogTrigger>

        <DialogContent
          className={cn(
            "h-[calc(100vh-40px)] max-w-[1200px] min-w-[1200px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-[#0b1220]",
            "sm:h-[calc(100vh-64px)] sm:w-[calc(100vw-64px)]",
          )}
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Store manager
              </DialogTitle>

              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-8 w-8 cursor-pointer rounded-full"
                >
                  <IoClose />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="h-[calc(100%-56px)] border-t border-slate-200 dark:border-slate-800">
            <div className="flex h-full">
              {/* Left */}
              <aside className="w-[300px] shrink-0 border-r border-slate-200 bg-white px-0 py-2 dark:border-slate-800 dark:bg-[#0b1220]">
                <SidebarNav active={activeNav} setActive={onNavigate} />
              </aside>

              {/* Right */}
              <main className="max-h-[90vh] flex-1 overflow-y-auto bg-[#f6f7fb] px-8 py-8 dark:bg-[#0a1020]">
                <GetAllAttribute />
                <GetAllcategory />
                <GetAllBrand />
                <RightContent active={activeNav} onNavigate={onNavigate} />
              </main>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
