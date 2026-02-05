"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  X,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  ShoppingBag,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import Navigation from "../navigation/Navigation";

type HeaderLayoutId = "logo-left" | "logo-center" | "logo-right" | "minimal" | "stacked";
type IconSize = "small" | "medium" | "large";
type StyleMode = "normal" | "hover";
type LogoMode = "image" | "text";

function Row({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[16px] font-semibold text-slate-900">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  value,
  setValue,
  min = 0,
  max = 120,
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold text-slate-900">{label}</div>
        <div className="text-[16px] font-semibold text-slate-900">{value} px</div>
      </div>

      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={(v) => setValue(v?.[0] ?? value)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  checked,
  onCheckedChange,
  subtitle,
  actionText,
  onAction,
}: {
  title: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-0 mb-4  ">
      <div className="space-y-1">
        <div className="text-[16px] font-semibold text-slate-900">{title}</div>
        {subtitle ? (
          <div className="text-sm text-slate-600">{subtitle}</div>
        ) : null}
        {actionText ? (
          <button
            type="button"
            onClick={onAction}
            className="text-[16px] font-semibold text-violet-700 hover:underline"
          >
            {actionText}
          </button>
        ) : null}
      </div>

      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function LayoutPreview({
  id,
  active,
  onClick,
}: {
  id: HeaderLayoutId;
  active: boolean;
  onClick: () => void;
}) {
  // simple skeleton preview like screenshot
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border bg-white px-4 py-5 text-left transition",
        active ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">LOGO</div>

        <div className="flex flex-1 justify-center gap-2">
          <div className="h-1.5 w-10 rounded-full bg-slate-400/80" />
          <div className="h-1.5 w-10 rounded-full bg-slate-400/80" />
          <div className="h-1.5 w-10 rounded-full bg-slate-400/80" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <ShoppingBag className="h-4 w-4 text-slate-500" />
          </div>
          <div className="h-9 w-16 rounded-lg bg-slate-500/70" />
        </div>
      </div>
      <div className="sr-only">{id}</div>
    </button>
  );
}

function IconCard({
  label,
  size,
  selected,
  onSelect,
}: {
  label: string;
  size: IconSize;
  selected: boolean;
  onSelect: () => void;
}) {
  const px = size === "small" ? 18 : size === "medium" ? 24 : 30;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex-1 rounded-xl border bg-white p-4 text-center transition",
        selected ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 items-center justify-center">
        <ShoppingBag style={{ width: px, height: px }} className="text-slate-600" />
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{label}</div>
    </button>
  );
}

export default function HeaderEditForm() {
  const [open, setOpen] = React.useState(false);

  // Layout tab
  const [sticky, setSticky] = React.useState(true);
  const [elementSpacing, setElementSpacing] = React.useState(64);
  const [linkSpacing, setLinkSpacing] = React.useState(40);
  const [verticalSpacing, setVerticalSpacing] = React.useState(24);
  const [layout, setLayout] = React.useState<HeaderLayoutId>("minimal");

  // Elements tab
  const [showLogo, setShowLogo] = React.useState(true);
  const [showSocial, setShowSocial] = React.useState(true);
  const [showButton, setShowButton] = React.useState(true);
  const [showCart, setShowCart] = React.useState(true);

  // Logo tab
  const [logoMode, setLogoMode] = React.useState<LogoMode>("image");
  const [logoWidth, setLogoWidth] = React.useState(64);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Shopping bag tab
  const [iconText, setIconText] = React.useState("Cart");
  const [iconSize, setIconSize] = React.useState<IconSize>("large");

  // Style tab
  const [styleTarget, setStyleTarget] = React.useState("header");
  const [styleMode, setStyleMode] = React.useState<StyleMode>("normal");
  const [transparentHeader, setTransparentHeader] = React.useState(false);
  const [fontName, setFontName] = React.useState("Poppins");
  const [textColor, setTextColor] = React.useState("#111111");

  const onPickLogo = () => fileRef.current?.click();
  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoUrl(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          Header Form
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-[560px] overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-2xl">
        {/* Header */}
        <DialogHeader className="relative px-6 pt-6 pb-3">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Header settings
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-slate-700" />
            </button>
          </DialogClose>

          {/* Top tabs (scrollable like screenshot) */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="layout" className="w-full">
                <div className="relative">
                  <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
                  <div className="overflow-x-auto no-scrollbar">
                    <TabsList className="
  inline-flex w-max items-end gap-6
  rounded-none bg-transparent p-0
  overflow-x-auto overflow-y-hidden
  whitespace-nowrap
  no-scrollbar
">
                      {[
                        { value: "layout", label: "Layout" },
                        { value: "elements", label: "Elements" },
                        { value: "logo", label: "Logo" },
                        { value: "navigation", label: "Navigation" },
                        { value: "bag", label: "Shopping bag" },
                        { value: "style", label: "Style" },
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="
                             relative h-10 px-0 pb-3
                             text-[16px] font-medium text-slate-500
                              bg-transparent rounded-none border-none shadow-none
                              focus:bg-transparent focus-visible:bg-transparent
                                data-[state=active]:bg-transparent
                              data-[state=active]:shadow-none

        after:absolute after:left-0 after:bottom-0
        after:h-[2px] after:w-0 after:bg-violet-600
        after:transition-all after:duration-300

        data-[state=active]:text-black
        data-[state=active]:after:w-full
      "
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* Body */}
                <ScrollArea className="h-[400px]">
                  <div className="px-4 py-2">
                    {/* ============ LAYOUT TAB ============ */}
                    <TabsContent value="layout" className="mt-0">
                      <div className="space-y-4">
                        <ToggleRow
                          title="Make header sticky"
                          checked={sticky}
                          onCheckedChange={setSticky}
                        />

                        <Separator className="bg-slate-200" />

                        <SliderRow
                          label="Element spacing"
                          value={elementSpacing}
                          setValue={setElementSpacing}
                          min={0}
                          max={120}
                        />

                        <Separator className="bg-slate-200" />

                        <SliderRow
                          label="Link spacing"
                          value={linkSpacing}
                          setValue={setLinkSpacing}
                          min={0}
                          max={120}
                        />

                        <Separator className="bg-slate-200" />

                        <SliderRow
                          label="Top and bottom spacing"
                          value={verticalSpacing}
                          setValue={setVerticalSpacing}
                          min={0}
                          max={80}
                        />

                        <Separator className="bg-slate-200" />

                        <Row title="Header layout">
                          <div className="space-y-3">
                            <LayoutPreview
                              id="logo-left"
                              active={layout === "logo-left"}
                              onClick={() => setLayout("logo-left")}
                            />
                            <LayoutPreview
                              id="logo-center"
                              active={layout === "logo-center"}
                              onClick={() => setLayout("logo-center")}
                            />
                            <LayoutPreview
                              id="logo-right"
                              active={layout === "logo-right"}
                              onClick={() => setLayout("logo-right")}
                            />
                            <LayoutPreview
                              id="minimal"
                              active={layout === "minimal"}
                              onClick={() => setLayout("minimal")}
                            />
                            <LayoutPreview
                              id="stacked"
                              active={layout === "stacked"}
                              onClick={() => setLayout("stacked")}
                            />
                          </div>
                        </Row>
                      </div>
                    </TabsContent>

                    {/* ============ ELEMENTS TAB ============ */}
                    <TabsContent value="elements" className="mt-0">
                      <div className="space-y-7">
                        <ToggleRow
                          title="Show logo"
                          checked={showLogo}
                          onCheckedChange={setShowLogo}
                          actionText="Edit logo"
                          onAction={() => { }}
                        />

                        <ToggleRow
                          title="Show navigation"
                          checked={showLogo}
                          onCheckedChange={setShowLogo}
                          actionText="Edit navigation"
                          onAction={() => { }}
                        />

                        <ToggleRow
                          title="Show social icons"
                          checked={showSocial}
                          onCheckedChange={setShowSocial}
                          actionText="Edit social icons"
                          onAction={() => { }}
                        />
                        <ToggleRow
                          title="Show button"
                          checked={showButton}
                          onCheckedChange={setShowButton}
                          actionText="Edit button"
                          onAction={() => { }}
                        />
                        <ToggleRow
                          title="Show shopping cart"
                          checked={showCart}
                          onCheckedChange={setShowCart}
                          actionText="Edit shopping cart"
                          onAction={() => { }}
                        />
                      </div>
                    </TabsContent>

                    {/* ============ LOGO TAB ============ */}
                    <TabsContent value="logo" className="mt-0">
                      <div className="space-y-6">
                        {/* segmented control */}
                        <div className="rounded-full bg-slate-100 p-1">
                          <div className="grid grid-cols-2">
                            <button
                              type="button"
                              onClick={() => setLogoMode("image")}
                              className={[
                                "h-10 rounded-full text-[16px] font-semibold transition",
                                logoMode === "image"
                                  ? "bg-white text-slate-900 shadow"
                                  : "text-slate-500",
                              ].join(" ")}
                            >
                              Image
                            </button>
                            <button
                              type="button"
                              onClick={() => setLogoMode("text")}
                              className={[
                                "h-10 rounded-full text-[16px] font-semibold transition",
                                logoMode === "text"
                                  ? "bg-white text-slate-900 shadow"
                                  : "text-slate-500",
                              ].join(" ")}
                            >
                              Text
                            </button>
                          </div>
                        </div>

                        {/* image/text area */}
                        {logoMode === "image" ? (
                          <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
                              <div className="aspect-[16/6] w-full">
                                {logoUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={logoUrl}
                                    alt="Logo"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                                    <LayoutGrid className="h-7 w-7" />
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={onPickLogo}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition hover:opacity-100"
                              >
                                <span className="inline-flex items-center gap-2 text-[16px] font-semibold">
                                  <ImageIcon className="h-5 w-5" />
                                  Replace image
                                </span>
                              </button>

                              <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={onLogoFile}
                                className="hidden"
                              />
                            </div>

                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-[16px] font-semibold text-violet-700 hover:underline"
                            >
                              <Sparkles className="h-5 w-5" />
                              Use AI to create a unique logo
                            </button>

                            <Separator className="bg-slate-200" />

                            <SliderRow
                              label="Logo width"
                              value={logoWidth}
                              setValue={setLogoWidth}
                              min={24}
                              max={220}
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <div className="text-sm font-semibold text-slate-700">
                                Logo text
                              </div>
                              <Input
                                className="mt-2 h-12 rounded-xl"
                                placeholder="Your brand name"
                                defaultValue="MINA"
                              />
                              <div className="mt-3 text-xs text-slate-500">
                                (Preview only — connect to your real state later)
                              </div>
                            </div>

                            <Separator className="bg-slate-200" />

                            <SliderRow
                              label="Logo width"
                              value={logoWidth}
                              setValue={setLogoWidth}
                              min={24}
                              max={220}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                          <TabsContent value="navigation" className="mt-0">
                              {/* <Navigation/> */}
                          </TabsContent>

                    {/* ============ SHOPPING BAG TAB ============ */}
                    <TabsContent value="bag" className="mt-0">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="text-[16px] font-semibold text-slate-900">
                            Icon text
                          </div>
                          <Input
                            value={iconText}
                            onChange={(e) => setIconText(e.target.value)}
                            className="h-12 rounded-xl bg-slate-50"
                          />
                        </div>

                        <Separator className="bg-slate-200" />

                        <Row title="Icon size">
                          <div className="grid grid-cols-3 gap-4">
                            <IconCard
                              label="Small"
                              size="small"
                              selected={iconSize === "small"}
                              onSelect={() => setIconSize("small")}
                            />
                            <IconCard
                              label="Medium"
                              size="medium"
                              selected={iconSize === "medium"}
                              onSelect={() => setIconSize("medium")}
                            />
                            <IconCard
                              label="Large"
                              size="large"
                              selected={iconSize === "large"}
                              onSelect={() => setIconSize("large")}
                            />
                          </div>
                        </Row>

                        <Separator className="bg-slate-200" />

                        <Row title="Express checkout">
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="text-sm font-medium text-slate-900">
                              Express checkout won’t work until the Stripe payment
                              method is fully connected.
                            </div>
                            <Button
                              type="button"
                              className="mt-4 h-11 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300"
                            >
                              Go to payments
                            </Button>
                          </div>
                        </Row>
                      </div>
                    </TabsContent>

                    {/* ============ STYLE TAB ============ */}
                    <TabsContent value="style" className="mt-0">
                      <div className="space-y-6">
                        {/* <div className="flex items-center gap-2 text-slate-500">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium hover:text-slate-900"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            out
                          </button>
                          <div className="text-sm font-medium">Elements</div>
                          <div className="text-sm font-medium">Logo</div>
                          <div className="text-sm font-medium">Shopping bag</div>
                          <div className="text-sm font-semibold text-violet-700">
                            Style
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </div> */}

                        <div className="space-y-3">
                          <Select value={styleTarget} onValueChange={setStyleTarget}>
                            <SelectTrigger className="h-12 rounded-xl bg-white w-full">
                              <SelectValue placeholder="Header" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="links">Links</SelectItem>
                              <SelectItem value="button">Button</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="rounded-full bg-slate-100 p-1">
                            <div className="grid grid-cols-2">
                              <button
                                type="button"
                                onClick={() => setStyleMode("normal")}
                                className={[
                                  "h-10 rounded-full text-[16px] font-semibold transition",
                                  styleMode === "normal"
                                    ? "bg-white text-slate-900 shadow"
                                    : "text-slate-500",
                                ].join(" ")}
                              >
                                Normal
                              </button>
                              <button
                                type="button"
                                onClick={() => setStyleMode("hover")}
                                className={[
                                  "h-10 rounded-full text-[16px] font-semibold transition",
                                  styleMode === "hover"
                                    ? "bg-white text-slate-900 shadow"
                                    : "text-slate-500",
                                ].join(" ")}
                              >
                                Hover
                              </button>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-slate-200" />

                        <ToggleRow
                          title="Transparent header"
                          checked={transparentHeader}
                          onCheckedChange={setTransparentHeader}
                        />

                        <Separator className="bg-slate-200" />

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-[16px] font-semibold text-slate-900">
                            Text font
                          </div>
                          <div className="inline-flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2">
                            <div className="text-[16px] font-semibold text-slate-900">
                              {fontName}
                            </div>
                            <button
                              type="button"
                              onClick={() => setFontName(fontName === "Poppins" ? "Inter" : "Poppins")}
                              className="text-[16px] font-semibold text-violet-700 hover:underline"
                            >
                              Change
                            </button>
                          </div>
                        </div>

                        <Separator className="bg-slate-200" />

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-[16px] font-semibold text-slate-900">
                            Header text color
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 bg-transparent p-0"
                              aria-label="Text color"
                            />
                            <div
                              className="h-10 w-10 rounded-full border border-slate-200"
                              style={{ backgroundColor: textColor }}
                              aria-hidden
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full rounded-2xl border-slate-200 text-[16px] font-semibold text-violet-700 hover:bg-slate-50"
                          >
                            Edit text styles
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="h-11 rounded-md">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button className="h-11 rounded-md ">
                    Save changes
                  </Button>
                </div>
              </Tabs>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
