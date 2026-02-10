"use client";

import * as React from "react";
import { FiEdit } from "react-icons/fi";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    ChevronDown,
    ExternalLink,
    GripVertical,
    Trash2,
    Plus,
    X,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import CurrentForm from "../sectionEdit/CurrentForm";
import { ACCENT } from "./constants";
import { TabHeader } from "./TabHeader";
import { PillTabs } from "./PillTabs";
import { SettingRow } from "./SettingRow";
import { IconRadio } from "./IconRadio";
import { AnimationCard } from "./AnimationCard";
import { FormMode, FormSettings, FieldInputType, FormField, StyleElement, Anim } from "./types";
import General from "./General";

const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? // @ts-ignore
        crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10);

const INPUT_TYPE_PRESETS: Record<
    FieldInputType,
    Pick<FormField, "label" | "placeholder" | "options">
> = {
    short: { label: "Short answer", placeholder: "Your answer", options: [] },
    paragraph: {
        label: "Paragraph",
        placeholder: "Write your message...",
        options: [],
    },
    single: { label: "Single choice", placeholder: "", options: ["Option 1", "Option 2"] },
    multi: { label: "Multiple choice", placeholder: "", options: ["Option 1", "Option 2"] },
};

const DEFAULT_SETTINGS: FormSettings = {
    mode: "standalone",
    formName: "Contact form 1",
    notifyEmail: "mail2deepakrai@gmail.com",

    // ✅ fields now match screenshot behavior (accordion editable)
    fields: [
        {
            id: uid(),
            label: "Name",
            enabled: true,
            required: true,
            inputType: "short",
            placeholder: "Your name",
            requiredMessage: "This field is required",
            options: [],
        },
        {
            id: uid(),
            label: "Last name",
            enabled: true,
            required: true,
            inputType: "short",
            placeholder: "Your last name",
            requiredMessage: "This field is required",
            options: [],
        },
        {
            id: uid(),
            label: "Email",
            enabled: true,
            required: true,
            inputType: "short",
            placeholder: "Your email",
            requiredMessage: "This field is required",
            options: [],
        },
        {
            id: uid(),
            label: "Message",
            enabled: true,
            required: true,
            inputType: "paragraph",
            placeholder: "Write your message...",
            requiredMessage: "This field is required",
            options: [],
        },
    ],

    buttonText: "Submit",
    stretchOnMobile: false,
    buttonPosition: "center",
    submitAction: "message",
    thankYouMessage: "Thank You!",
    redirectUrl: "",

    styleElement: "form_fields",
    styleState: "normal",
    fillColor: "#FFFFFF",
    fontFamily: "Poppins",
    labelTextColor: "#0F172A",
    labelTextSize: 14,
    fieldTextColor: "#0F172A",
    fieldTextSize: 16,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    cornerRadius: 10,
    spacing: 15,

    animation: "slide",
};




export function FormsPage({
 
    componentHtml,
}: {
    open?: boolean;
    setOpen?: (open: boolean) => void;
    componentHtml?: string;
} = {}) {
    const [tab, setTab] = React.useState<
        "general" | "fields" | "button" | "style" | "animation"
    >("general");


    const [settings, setSettings] = React.useState<FormSettings>(DEFAULT_SETTINGS);

    const set = <K extends keyof FormSettings>(key: K, val: FormSettings[K]) =>
        setSettings((s) => ({ ...s, [key]: val }));

    const onSave = (e: React.FormEvent) => {
        e.preventDefault();
        // ✅ send `settings` to API / store
        // console.log(settings)
    };


    const tabsWrapRef = React.useRef<HTMLDivElement | null>(null);
    return (
        <div>
            <div
                ref={tabsWrapRef}
                className="px-0 border-b border-slate-200 pb-2  whitespace-nowrap "
            >
                <PillTabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} />
            </div>

            <ScrollArea className=" border-b border-gray-200 mt-4 ">
                <div className="px-0 py-0">
                    {/* GENERAL */}
                    {tab === "general" ? (
                        <General
                       
                        />
                    ) : null}

                    {/* FIELDS (✅ replaced with accordion UI like screenshot) */}
                    {tab === "fields" ? (
                        <CurrentForm
                        />

                    ) : null}

                    {/* BUTTON */}
                    {tab === "button" ? (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Button text</Label>
                                <Input
                                    value={settings.buttonText}
                                    onChange={(e) => set("buttonText", e.target.value)}
                                    className="h-11 rounded-md"
                                />
                            </div>

                            <SettingRow
                                title="Stretch button to full width on mobile"
                                right={
                                    <Switch
                                        checked={settings.stretchOnMobile}
                                        onCheckedChange={(v) => set("stretchOnMobile", v)}
                                        className="data-[state=checked]:bg-[var(--accent)]"
                                        style={
                                            {
                                                ["--accent" as any]: ACCENT,
                                            } as React.CSSProperties
                                        }
                                    />
                                }
                            />

                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-slate-900">
                                    Button position
                                </div>
                                <div className="flex items-center gap-2">
                                    {(
                                        [
                                            ["left", <AlignLeft key="l" className="h-4 w-4" />],
                                            [
                                                "center",
                                                <AlignCenter key="c" className="h-4 w-4" />,
                                            ],
                                            ["right", <AlignRight key="r" className="h-4 w-4" />],
                                        ] as const
                                    ).map(([pos, icon]) => {
                                        const active = settings.buttonPosition === pos;
                                        return (
                                            <Button
                                                key={pos}
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "h-8 w-10 rounded-md",
                                                    active && "border-transparent"
                                                )}
                                                style={
                                                    active
                                                        ? {
                                                            outline: `2px solid ${ACCENT}`,
                                                            background: "white",
                                                        }
                                                        : undefined
                                                }
                                                onClick={() => set("buttonPosition", pos)}
                                            >
                                                {icon}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="text-sm font-semibold text-slate-900">
                                    When visitors submit a form:
                                </div>

                                <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
                                    <button
                                        type="button"
                                        onClick={() => set("submitAction", "message")}
                                        className={cn(
                                            "h-8 rounded-md text-sm font-medium transition",
                                            settings.submitAction === "message"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500"
                                        )}
                                    >
                                        Show message
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => set("submitAction", "link")}
                                        className={cn(
                                            "h-8 rounded-md text-sm font-medium transition",
                                            settings.submitAction === "link"
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500"
                                        )}
                                    >
                                        Link to page
                                    </button>
                                </div>

                                {settings.submitAction === "message" ? (
                                    <Textarea
                                        value={settings.thankYouMessage}
                                        onChange={(e) => set("thankYouMessage", e.target.value)}
                                        className="min-h-[120px] rounded-md"
                                        placeholder="Thank You!"
                                    />
                                ) : (
                                    <Input
                                        value={settings.redirectUrl}
                                        onChange={(e) => set("redirectUrl", e.target.value)}
                                        className="h-10 rounded-md"
                                        placeholder="https://your-site.com/thank-you"
                                    />
                                )}

                                <div className="text-xs text-slate-500">
                                    Display this message to users after they submit your form.
                                </div>

                                <Button
                                    type="button"
                                    className="w-full rounded-md text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <FiEdit className="mr-2 h-4 w-4" />
                                    Change button styles
                                </Button>
                            </div>
                        </div>
                    ) : null}

                    {/* STYLE */}
                    {tab === "style" ? (
                        <div className="space-y-5 ">
                            <div className="space-y-2 ">
                                <div className="text-sm font-semibold text-slate-900">
                                    Customize elements
                                </div>
                                <Select
                                    value={settings.styleElement}
                                    onValueChange={(v) => set("styleElement", v as StyleElement)}

                                >
                                    <SelectTrigger className="h-11 rounded-md w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectItem value="form_fields">Form fields</SelectItem>
                                        <SelectItem value="labels">Labels</SelectItem>
                                        <SelectItem value="button">Button</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                                {(["normal", "hover"] as const).map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => set("styleState", v)}
                                        className={cn(
                                            "h-10 rounded-md text-sm font-medium transition",
                                            settings.styleState === v
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500"
                                        )}
                                    >
                                        {v === "normal" ? "Normal" : "Hover"}
                                    </button>
                                ))}
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-900">
                                    Fill color
                                </div>
                                <Input
                                    type="color"
                                    value={settings.fillColor}
                                    onChange={(e) => set("fillColor", e.target.value)}
                                    className="h-10 w-14 cursor-pointer rounded-md p-1"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm font-medium text-slate-900">
                                    Text font
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-md bg-slate-100 px-3 py-2 text-sm">
                                        {settings.fontFamily}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-10 rounded-md"
                                        style={{ color: ACCENT }}
                                        onClick={() =>
                                            set(
                                                "fontFamily",
                                                settings.fontFamily === "Poppins" ? "Inter" : "Poppins"
                                            )
                                        }
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-slate-900">
                                        Label text color
                                    </div>
                                    <Input
                                        type="color"
                                        value={settings.labelTextColor}
                                        onChange={(e) => set("labelTextColor", e.target.value)}
                                        className="h-10 w-14 cursor-pointer rounded-md p-1"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-medium text-slate-900">
                                        Label text size
                                    </div>
                                    <div className="flex  items-center gap-3">
                                        <Slider
                                            value={[settings.labelTextSize]}
                                            onValueChange={(v) => set("labelTextSize", v[0] ?? 14)}
                                            min={10}
                                            max={22}
                                            step={1}
                                            className="w-20"
                                        />
                                        <div className="w-10 rounded-md border bg-white px-2 py-1 text-center text-sm">
                                            {settings.labelTextSize}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-slate-900">
                                        Field text color
                                    </div>
                                    <Input
                                        type="color"
                                        value={settings.fieldTextColor}
                                        onChange={(e) => set("fieldTextColor", e.target.value)}
                                        className="h-10 w-14 cursor-pointer rounded-md p-1"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-medium text-slate-900">
                                        Field text size
                                    </div>
                                    <div className="flex  items-center gap-3">
                                        <Slider
                                            value={[settings.fieldTextSize]}
                                            onValueChange={(v) => set("fieldTextSize", v[0] ?? 16)}
                                            min={10}
                                            max={24}
                                            step={1}
                                            className="w-20"
                                        />
                                        <div className="w-10 rounded-md border bg-white px-2 py-1 text-center text-sm">
                                            {settings.fieldTextSize}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-900">
                                    Border color
                                </div>
                                <Input
                                    type="color"
                                    value={settings.borderColor}
                                    onChange={(e) => set("borderColor", e.target.value)}
                                    className="h-10 w-14 cursor-pointer rounded-md p-1"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="text-sm font-medium text-slate-900">
                                    Border width
                                </div>
                                <div className="flex  items-center gap-3">
                                    <Slider
                                        value={[settings.borderWidth]}
                                        onValueChange={(v) => set("borderWidth", v[0] ?? 1)}
                                        min={0}
                                        max={6}
                                        step={1}
                                        className="w-20"
                                    />
                                    <div className="w-10 rounded-md border bg-white px-2 py-1 text-center text-sm">
                                        {settings.borderWidth}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="text-sm font-medium text-slate-900">
                                    Corner radius
                                </div>
                                <div className="flex items-center gap-3">
                                    <Slider
                                        value={[settings.cornerRadius]}
                                        onValueChange={(v) => set("cornerRadius", v[0] ?? 10)}
                                        min={0}
                                        max={24}
                                        step={1}
                                        className="w-20"

                                    />
                                    <div className="w-10 rounded-md border bg-white px-2 py-1 text-center text-sm">
                                        {settings.cornerRadius}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="text-sm font-medium text-slate-900">
                                    Spacing between elements
                                </div>
                                <div className="flex  items-center gap-3">
                                    <Slider
                                        value={[settings.spacing]}
                                        onValueChange={(v) => set("spacing", v[0] ?? 15)}
                                        min={6}
                                        max={30}
                                        step={1}
                                        className="w-20"
                                    />
                                    <div className="w-10 rounded-md border bg-white px-2 py-1 text-center text-sm">
                                        {settings.spacing}
                                    </div>
                                </div>
                            </div>

                            {/* ANIMATION */}

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 p-1">
                                    <AnimationCard
                                        title="No animation"
                                        active={settings.animation === "none"}
                                        onClick={() => set("animation", "none")}
                                    />
                                    <AnimationCard
                                        title="Fade"
                                        active={settings.animation === "fade"}
                                        onClick={() => set("animation", "fade")}
                                    />
                                    <AnimationCard
                                        title="Slide"
                                        active={settings.animation === "slide"}
                                        onClick={() => set("animation", "slide")}
                                    />
                                    <AnimationCard
                                        title="Scale"
                                        active={settings.animation === "scale"}
                                        onClick={() => set("animation", "scale")}
                                    />
                                </div>
                            </div>

                        </div>
                    ) : null}

                    {/* ANIMATION */}
                    {/* {tab === "animation" ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <AnimationCard
                                    title="No animation"
                                    active={settings.animation === "none"}
                                    onClick={() => set("animation", "none")}
                                />
                                <AnimationCard
                                    title="Fade"
                                    active={settings.animation === "fade"}
                                    onClick={() => set("animation", "fade")}
                                />
                                <AnimationCard
                                    title="Slide"
                                    active={settings.animation === "slide"}
                                    onClick={() => set("animation", "slide")}
                                />
                                <AnimationCard
                                    title="Scale"
                                    active={settings.animation === "scale"}
                                    onClick={() => set("animation", "scale")}
                                />
                            </div>
                        </div>
                    ) : null} */}
                </div>
            </ScrollArea>
        </div>

    )
}

export default FormsPage