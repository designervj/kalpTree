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
} from "lucide-react";
import OverviewPage from "./OverviewPage";
import AppointmentsPage from "../appointments/AppointmentsPage";
import StoreDetails from "../storeSetting/StoreDetails";
import CompanyInformation from "../storeSetting/CompanyInformation";
import Payments from "../storeSetting/Payments";
import Shipping from "../storeSetting/Shipping";
import Checkout from "../storeSetting/Checkout";

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
  { id: "appointments", label: "Appointments", icon: <Calendar className="h-4 w-4" /> },
  { id: "discounts", label: "Discounts", icon: <Percent className="h-4 w-4" /> },
  { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
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
        ],
  },
  { id: "integrations", label: "Integrations", icon: <Boxes className="h-4 w-4" /> },
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
          : "border-slate-300 bg-white text-transparent dark:border-slate-700 dark:bg-transparent"
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

  const isGroupActive = (groupId: string, children?: NavChild[]) => {
    if (!children?.length) return active === groupId;
    return children.some((c) => c.id === active) || active === groupId;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Setup card */}
      <div className="rounded-2xl border border-violet-200/60 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/10 mx-2 mb-2">
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

          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-200">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>

        <Button
          variant="outline"
          className={cn(
            "mt-3 h-10 w-full justify-start rounded-xl",
            "border-violet-200 bg-white text-violet-700 hover:bg-slate-50",
            "dark:border-violet-500/25 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
          )}
          onClick={() => setActive("store-setup")}
        >
          Add payment method
        </Button>
      </div>
      <hr/>

      {/* Nav */}
      <div className="mt-4 space-y-1 max-h-[50vh]  overflow-y-auto px-2">
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
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors",
                  activeGroup
                    ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-slate-500 dark:text-slate-300",
                      activeGroup && "text-violet-700 dark:text-violet-200"
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
                      activeGroup && "text-violet-600 dark:text-violet-200"
                    ),
                  })
                ) : (
                  <span className="opacity-0">.</span>
                )}
              </button>

              {/* children */}
              {item.id === "products-group" && productsOpen && item.children?.length ? (
                <div className="mt-1 space-y-1 pl-9">
                  {item.children.map((c) => {
                    const isActive = active === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {item.id === "settings-group" && settingsOpen && item.children?.length ? (
                <div className="mt-1 space-y-1 pl-9">
                  {item.children.map((c) => {
                    const isActive = active === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActive(c.id)}
                        className={cn(
                          "flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
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
            "mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ",
            "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
          )}
        >
          <span className="text-slate-400 dark:text-slate-500">
            <ChevronRight className="h-4 w-4" />
          </span>
          <span className="text-sm">Help and resources</span>
        </button>
      </div>

      <div className="mt-auto pt-4 px-2">
        <Separator className="bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-slate-300 dark:border-slate-700" />
            Feedback
          </div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
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

function Banner() {
  return (
    <div className="relative rounded-2xl border border-violet-200/60 bg-violet-50 p-6 dark:border-violet-500/20 dark:bg-violet-500/10">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-[620px]">
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Sell custom products. Skip the logistics.
            </div>
            <Badge className="rounded-full bg-white text-slate-700 dark:bg-white/10 dark:text-slate-200">
              New
            </Badge>
          </div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Create and sell branded products with Printful. No inventory, no upfront costs.
          </div>

          <div className="mt-5 flex items-center gap-4">
            <Button className="rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">
              Get started
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl text-violet-700 hover:bg-white/60 dark:text-violet-200 dark:hover:bg-white/5"
            >
              Learn more <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="hidden w-[340px] shrink-0 items-center justify-center md:flex">
          <div className="relative h-[140px] w-full rounded-2xl bg-white/70 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-slate-800">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full p-1.5 text-slate-500 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/5"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="space-y-6">
      <Banner />

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            Products{" "}
            <span className="text-base font-normal text-slate-500 dark:text-slate-400">
              (10 products)
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
          >
            Import products
          </Button>
          <Button className="h-10 rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">
            Add product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Category
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
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
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] w-full">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
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
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
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
              className="h-11 rounded-xl border-slate-200 bg-white pl-9 dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="Search for product"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
        <UITableHeader className="bg-white dark:bg-[#0b1220] border-b border-gray-900 w-[100%]">
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
            <TableRow key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 w-[100%]">
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

              <TableCell className="text-sm text-slate-700 dark:text-slate-200 w-[100px]">{p.price}</TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-200 w-[100px]">{p.variants}</TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-200 w-[100px]">{p.inventory}</TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-200 w-[100px]">{p.sku}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 text-xs",
                    p.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                      : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200"
                  )}
                >
                  {p.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right text-slate-400 dark:text-slate-500">
                <button
                  type="button"
                  className={cn("rounded-lg px-2 py-1 hover:bg-slate-100", "dark:hover:bg-white/5")}
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

function IntegrationsPage() {
  const rows = [
    { id: "shippo", title: "Generate shipping labels for your orders (Shippo)", desc: "Generate shipping labels, automate tracking and returns, and access discounted rates.", new: true, openable: false },
    { id: "printful", title: "Create and sell custom products (Printful)", desc: "Print on demand is free, easy, and risk-free. Skip managing stock and shipping.", new: false, openable: false },
    { id: "reach", title: "Email marketing with Hostinger Reach", desc: "Connect with your subscribers and grow your brand by sending newsletters.", new: false, openable: false },
    { id: "whatsapp", title: "WhatsApp", desc: "Engage with customers in real-time through convenient and direct chat.", new: false, openable: true },
    { id: "meta", title: "Meta Pixel", desc: "Improve ad targeting by tracking visitor actions on your website.", new: false, openable: true },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Integrations</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Easily link your website to popular tools and services. After connecting an app, update your website to activate it.
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((r) => (
          <div
            key={r.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0b1220]",
              r.new
                ? "border-violet-400/70 ring-1 ring-violet-400/40 dark:border-violet-500/40"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5" />
                <div>
                  <div className="flex items-center gap-2">
                    {r.new ? (
                      <Badge className="rounded-full bg-violet-600 text-white">New</Badge>
                    ) : null}
                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {r.title}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.desc}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {r.openable ? (
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                ) : (
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
                  >
                    Get started
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Analytics</div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
        >
          Dec 28, 2025 — Jan 26, 2026 <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
        >
          No comparison <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="text-sm text-slate-600 dark:text-slate-300">Total Sales</div>
        <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">$0.00</div>
        <div className="mt-4 h-[220px] rounded-xl bg-slate-50 dark:bg-white/5" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Orders</div>
          <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">0</div>
          <div className="mt-4 h-[200px] rounded-xl bg-slate-50 dark:bg-white/5" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
          <div className="text-sm text-slate-600 dark:text-slate-300">Average order value</div>
          <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">$0.00</div>
          <div className="mt-4 h-[200px] rounded-xl bg-slate-50 dark:bg-white/5" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Total sales by product</div>
          <button type="button" className="text-sm font-medium text-violet-700 dark:text-violet-200">
            Sort by: Sales ↑
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/5" />
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.name}</div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">0 sales</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
              Connect with your subscribers and grow your brand by sending newsletters.
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button className="rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">Get started</Button>
              <Button
                variant="ghost"
                className="rounded-xl text-violet-700 hover:bg-white/60 dark:text-violet-200 dark:hover:bg-white/5"
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
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Customers</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            A list of all customers who have made purchases from your store.
          </div>
        </div>

        <Button
          variant="outline"
          disabled
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-[#0b1220]"
        >
          Export to CSV
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-300/60 bg-violet-50 px-5 py-4 dark:border-violet-500/25 dark:bg-violet-500/10">
        <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-violet-700 ring-1 ring-violet-200 dark:bg-white/5 dark:text-violet-200 dark:ring-violet-500/25">
            <Info className="h-4 w-4" />
          </span>
          Start growing your email list by collecting marketing consent at checkout.
        </div>

        <div className="flex items-center gap-3">
          <Button className="rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">
            Go to checkout settings
          </Button>
          <button type="button" className="rounded-full p-2 text-slate-500 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Marketing consent</div>
        <Select defaultValue="granted">
          <SelectTrigger className="h-11 w-[220px] rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
            <SelectValue placeholder="Granted" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]">
            <SelectItem value="granted">Granted</SelectItem>
            <SelectItem value="not-granted">Not granted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-400">
        No customers yet — your first ones will appear here after you make a sale.
      </div>
    </div>
  );
}

function DiscountsPage() {
  const [type, setType] = React.useState<"percentage" | "fixed">("percentage");

  return (
    <div className="space-y-6 pb-24">
      <button type="button" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Back to discounts
      </button>

      <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Add discount</div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Discount type</div>

        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setType("percentage")}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
              type === "percentage"
                ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-200"
            )}
          >
            <Sparkles className="h-4 w-4" /> Percentage
          </button>

          <button
            type="button"
            onClick={() => setType("fixed")}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm",
              type === "fixed"
                ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-200"
            )}
          >
            <Tag className="h-4 w-4" /> Fixed amount
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">* Discount code</div>
            <Input
              className="mt-2 h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="e.g., BLACKFRIDAY50"
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Discount name</div>
            <Input
              className="mt-2 h-11 rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
              placeholder="e.g., Black Friday Campaign"
            />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Your customers won't see the discount name.
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            * Discount
          </div>
          <Input
            className="mt-2 h-11 max-w-[260px] rounded-xl border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
            defaultValue="1"
          />
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">* Apply to</div>
          <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-3">
              <input type="radio" name="applyto" defaultChecked />
              All products
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="applyto" />
              Specific categories
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">Discount conditions</div>
        <label className="mt-4 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
          <Checkbox />
          Limit the total number of uses for this discount
        </label>
      </div>

      {/* Sticky footer like screenshot */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-[calc(100vw-40px)] rounded-b-2xl border-x border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-[#0b1220]">
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="h-11 rounded-xl border-slate-200 dark:border-slate-800">
              Cancel
            </Button>
            <Button className="h-11 rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Categories</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            To show products by category on your website, add eCommerce section in the editor and adjust its settings.{" "}
            <span className="text-violet-700 dark:text-violet-200">Learn more.</span>
          </div>
        </div>

        <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-200">
          <span className="text-lg">+</span> Add category
        </button>
      </div>

      <div className="max-w-[360px] rounded-2xl border border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-center justify-between px-5 py-5">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">All products</div>
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300">10 products</div>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300">
        <span className="font-semibold underline">Rate category management experience.</span> Help us improve.
      </div>
    </div>
  );
}

function StoreSetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">Set up your store</div>
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
            <div className="h-[110px] w-[140px] rounded-xl bg-violet-100/60 dark:bg-violet-500/10" />
            <div className="flex-1">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Connect a payment provider to receive orders
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                To accept and let your customers pay, add at least one payment method.
              </div>
            </div>
            <Button className="mt-6 h-11 rounded-xl bg-violet-600 text-white hover:bg-violet-600/90">
              Add payments
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Update company information</div>
          <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800">
          <DoneDot done />
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Review and setup your shipping
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Need some guidance?</div>
        <button type="button" className="text-sm font-semibold text-violet-700 dark:text-violet-200">
          View all articles <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
          Change order of products in your online store <ChevronRight className="float-right h-5 w-5 text-slate-400" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0b1220]">
          Set up your shippings <ChevronRight className="float-right h-5 w-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function SimplePage({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0b1220]">
      <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Page UI placeholder (wireframe) — replace with your real content.
      </div>
      <div className="mt-6 h-[260px] rounded-xl bg-slate-50 dark:bg-white/5" />
    </div>
  );
}


function RightContent({ active }: { active: string }) {
  if (active === "products") return <ProductsPage />;
  if (active === "integrations") return <IntegrationsPage />;
  if (active === "analytics") return <AnalyticsPage />;
  if (active === "customers") return <CustomersPage />;
  if (active === "discounts") return <DiscountsPage />;
  if (active === "appointments") return <AppointmentsPage />;
  if (active === "categories") return <CategoriesPage />;
  if (active === "store-setup") return <StoreSetupPage />;

  if (active === "product-reviews") return <SimplePage title="Product reviews" />;
  if (active === "overview") return <OverviewPage  />;
  if (active === "orders") return <SimplePage title="Orders" />;
  if (active === "settings") return <SimplePage title="Settings" />;

  if (active === "store-details") return <StoreDetails />;
  if (active === "company-information") return <CompanyInformation />;
  if (active === "payments") return <Payments  />;
  if (active === "shipping") return <Shipping  />;
  if (active === "checkout") return <Checkout  />;

  return <ProductsPage />;
}



/* -------------------- Main Component -------------------- */

export default function StorePage() {
  const [open, setOpen] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState<string>("products");

  return (
    <div >
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Replace this trigger with your menu item / icon click */}
        <DialogTrigger asChild>
          {/* <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-white/5"
          >
            Open Store manager <ChevronRight className="h-4 w-4" />
          </button> */}
          <span className="flex justify-end me-auto "
            onClick={() => setOpen(true)}
          >
            <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </span>
        </DialogTrigger>

        {/* ✅ FULL WIDTH / FULL HEIGHT MODAL */}
        <DialogContent
          className={cn(
            "p-0 overflow-hidden",
            "max-w-[1200px] min-w-[1200px] h-[calc(100vh-40px)]",
            "sm:w-[calc(100vw-64px)] sm:h-[calc(100vh-64px)]",
            "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220]"
          )}
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Store manager
              </DialogTitle>

              {/* <DialogClose asChild>
                <button
                  type="button"
                  className={cn(
                    "rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                    "dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
                  )}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogClose> */}
            </div>
          </DialogHeader>

          <div className="h-[calc(100%-56px)] border-t border-slate-200 dark:border-slate-800">
            <div className="flex h-full">
              {/* Left */}
              <aside className="w-[300px] shrink-0 border-r border-slate-200 bg-white px-0 py-2 dark:border-slate-800 dark:bg-[#0b1220]">
                <SidebarNav active={activeNav} setActive={setActiveNav} />
              </aside>

              {/* Right */}
              <main className="flex-1 overflow-y-auto bg-[#f6f7fb] px-8 py-8 dark:bg-[#0a1020] max-h-[90vh]">
                <RightContent active={activeNav} />
              </main>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
