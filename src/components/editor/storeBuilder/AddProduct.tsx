"use client";

import * as React from "react";
import {
  Box,
  Sparkles,
  DownloadCloud,
  BadgeCheck,
  CalendarDays,
  Heart,
  Gift,
  Shirt,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Wand2,
  Info,
} from "lucide-react";
import { IoClose } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SellType =
  | "physical"
  | "multi_physical"
  | "digital"
  | "service"
  | "appointment"
  | "donation"
  | "gift_card"
  | "print_on_demand";

type TypeCard = {
  key: SellType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { text: string; tone: "beta" | "new" };
};

function BadgePill({
  text,
  tone,
}: {
  text: string;
  tone: "beta" | "new";
}) {
  const cls =
    tone === "new"
      ? "bg-violet-50 text-violet-700 border-violet-100"
      : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      className={[
        "ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        cls,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function OptionCard({
  item,
  onPick,
}: {
  item: TypeCard;
  onPick: (key: SellType) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onPick(item.key)}
      className="group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:bg-slate-50/40"
    >
      <div className="flex h-full min-h-[92px]">
        <div className="grid w-[86px] place-items-center border-r border-slate-200 bg-slate-50">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <div className="flex items-center">
              <p className="truncate text-[15px] font-semibold text-slate-900">
                {item.title}
              </p>
              {item.badge ? (
                <BadgePill text={item.badge.text} tone={item.badge.tone} />
              ) : null}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {item.desc}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
        </div>
      </div>
    </button>
  );
}

function DividerRow() {
  return <div className="h-px w-full bg-slate-200" />;
}

function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <span className="text-sm text-slate-500">{subtitle}</span>
          ) : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function MiniHelpIcon() {
  return (
    <span className="inline-flex items-center justify-center">
      <Info className="h-4 w-4 text-slate-400" />
    </span>
  );
}

function ProductFormMock({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <div className="bg-slate-50">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-lg font-semibold text-slate-900">Product</p>
          </div>
        </div>

        <Select defaultValue="active">
          <SelectTrigger className=" w-[110px]  rounded-sm bg-white">
            <SelectValue placeholder="Active" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid gap-6">
          {/* Product card */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <div className="grid gap-5">
              {/* Upload boxes */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className="group flex min-h-[70px] w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50">
                      <Wand2 className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        <span className="mr-2 text-[11px] font-semibold text-violet-600">
                          Fast and easy
                        </span>
                        Upload images and generate product details with AI
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                </button>

                <label className="group flex min-h-[70px] w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-left hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100">
                      <ImageIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Upload images
                      </p>
                    </div>
                  </div>
                  <input type="file" className="hidden" multiple />
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                </label>
              </div>

              {/* Title / Ribbon */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8">
                  <Label className="text-xs text-slate-700">* Title</Label>
                  <Input
                    placeholder="Your product title"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-slate-700">Ribbon</Label>
                    <MiniHelpIcon />
                  </div>
                  <Input
                    placeholder="e.g. NEW"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-8">
                  <Label className="text-xs text-slate-700">Subtitle</Label>
                  <Input
                    placeholder="Your product subtitle"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Description editor mock */}
              <div>
                <Label className="text-xs text-slate-700">Description</Label>

                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-50"
                    >
                      AI Writer
                    </button>
                    <div className="mx-2 h-5 w-px bg-slate-200" />
                    {["H2", "H3", "B", "I", "U", "•", "1.", "〰", "≡"].map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {t}
                        </button>
                      )
                    )}
                  </div>
                  <textarea
                    className="min-h-[160px] w-full resize-none bg-white p-4 text-sm text-slate-900 outline-none"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <SectionTitle title="Pricing" />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <Label className="text-xs text-slate-700">* Price</Label>
                <Input className="mt-2 h-10 rounded-xl" placeholder="₹" />
              </div>
              <div>
                <Label className="text-xs text-slate-700">Discount price</Label>
                <Input className="mt-2 h-10 rounded-xl" placeholder="₹" />
                <p className="mt-1 text-[11px] text-slate-500">
                  Your final price with the discount applied.
                </p>
              </div>
              <div>
                <Label className="text-xs text-slate-700">SKU</Label>
                <Input className="mt-2 h-10 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs text-slate-700">Weight (kg)</Label>
                <Input className="mt-2 h-10 rounded-xl" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3">
                <Checkbox />
                <span className="text-sm text-slate-700">
                  Track quantity <span className="text-slate-400">(i)</span>
                </span>
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-700">
                  Hide “Add to bag” button
                </span>
                <Switch />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-700">
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
                i
              </span>
              To accept and let your customers pay, add at least one payment
              method. You can do it after creating a Product or now in{" "}
              <span className="font-semibold text-violet-700">
                Payments page.
              </span>
            </div>
          </Card>

          {/* Additional info */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    Additional info sections
                  </h3>
                  <MiniHelpIcon />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  A great place to add more information about your product or
                  store policies.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-violet-700 hover:bg-violet-50"
              >
                + Add info section
              </Button>
            </div>
          </Card>

          {/* Options */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Options</h3>
            <p className="mt-1 text-sm text-slate-600">
              Manage what options this product comes in, such as size, color, or
              weight. Unique variants will be created which you can then control
              individually.
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-violet-700 hover:bg-violet-50"
              >
                + Add option
              </Button>
            </div>
          </Card>

          {/* Custom field */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Custom field
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Enable customers to personalize this product by adding a custom
              text on it.
            </p>

            <div className="mt-4">
              <Label className="text-xs text-slate-700">Title</Label>
              <Input
                className="mt-2 h-10 rounded-xl"
                placeholder="e.g. What message would you like engraved on your product?"
              />
              <label className="mt-4 flex items-center gap-3">
                <Checkbox />
                <span className="text-sm text-slate-700">Mandatory</span>
              </label>
            </div>
          </Card>

          {/* Categories */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Categories
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Use categories to organize products on your online store.
              <span className="ml-2 text-violet-700">Learn more</span>
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-violet-700 hover:bg-violet-50"
              >
                + Add new category
              </Button>
            </div>
          </Card>

          {/* Related products */}
          <Card className="rounded-2xl border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">
              Related products
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Increase your sales by showing related products on this product’s
              page, such as “You may also like”, “Goes well together”, or
              similar.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Checkbox />
              <span className="text-sm text-slate-700">Show related products</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AddProduct() {
  const [step, setStep] = React.useState<"choose" | "form">("choose");
  const [picked, setPicked] = React.useState<SellType | null>(null);

  const cards: Record<SellType, TypeCard> = {
    physical: {
      key: "physical",
      title: "Physical product",
      desc: "Products that require shipping or pick up",
      icon: Box,
    },
    multi_physical: {
      key: "multi_physical",
      title: "Multiple physical products",
      desc: "Add up to 10 physical product at once using AI",
      icon: Sparkles,
    },
    digital: {
      key: "digital",
      title: "Digital product",
      desc: "Products that could be downloaded via link after purchase",
      icon: DownloadCloud,
    },
    service: {
      key: "service",
      title: "Service",
      desc: "Offer your expertise or abilities as a product",
      icon: BadgeCheck,
    },
    appointment: {
      key: "appointment",
      title: "Appointment",
      desc: "Services, that require date & time selection, before going to checkout",
      icon: CalendarDays,
    },
    donation: {
      key: "donation",
      title: "Donation",
      desc: "Collect donations for your campaign here",
      icon: Heart,
    },
    gift_card: {
      key: "gift_card",
      title: "Gift card",
      desc: "Prepaid cards that can be redeemed for store purchases",
      icon: Gift,
      badge: { text: "Beta", tone: "beta" },
    },
    print_on_demand: {
      key: "print_on_demand",
      title: "Print on demand product",
      desc: "Create a product with your custom design",
      icon: Shirt,
      badge: { text: "New", tone: "new" },
    },
  };

  const rows: [TypeCard, TypeCard][] = [
    [cards.physical, cards.multi_physical],
    [cards.digital, cards.service],
    [cards.appointment, cards.donation],
    [cards.gift_card, cards.print_on_demand],
  ];

  const pickType = (k: SellType) => {
    setPicked(k);
    setStep("form");
  };

  const backToChoose = () => {
    setStep("choose");
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // reset
          setStep("choose");
          setPicked(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-sm">Add product</Button>
      </DialogTrigger>

      <DialogContent className="w-[1200px] min-w-[1000px] overflow-hidden rounded-2xl border-slate-200 p-0 shadow-xl">
        {/* Step: Choose type */}
        {step === "choose" ? (
          <div className="bg-white">
            <div className="px-8 pb-4 py-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">
                What do you want to sell?
              </h2>

                  <DialogClose asChild>
                  <Button variant="outline" className="rounded-full w-8 h-8 cursor-pointer">
                 <IoClose />


                  </Button>
                </DialogClose>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="px-6 py-6">
                  <div className="space-y-6">
                    {rows.map((pair, idx) => (
                      <div key={idx} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <OptionCard item={pair[0]} onPick={pickType} />
                          <OptionCard item={pair[1]} onPick={pickType} />
                        </div>
                        {idx !== rows.length - 1 ? <DividerRow /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {picked ? `Selected: ${picked}` : null}
                </div>

            
              </div>
            </div>
          </div>
        ) : (
          // Step: Form mock (scrollable)
          <div className="max-h-[85vh] overflow-auto">
            <ProductFormMock onBack={backToChoose} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
