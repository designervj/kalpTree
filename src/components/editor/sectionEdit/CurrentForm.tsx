"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ChevronDown, GripVertical } from 'lucide-react';
import { Switch } from '@radix-ui/react-switch';
import { Input } from '@/components/ui/input';


type FormMode = "standalone" | "connected";

type FieldType =
    | "name"
    | "last_name"
    | "email"
    | "message"
    | "phone"
    | "company"
    | "website";

type FormField = {
    id: string;
    type: string;
    label: string;
    inputName: string;
    placeholder: string;
    required: boolean;
    enabled: boolean;
};
type BtnPos = "left" | "center" | "right";
type SubmitAction = "message" | "redirect";
type StyleElement = "form_fields" | "form_button";
type StyleState = "normal" | "hover";
type Anim = "slide" | "fade";
const uid = () => Math.random().toString(36).slice(2, 10);

/** 🎨 Keep the same purple look/feel */
const ACCENT = "#6D5EF5";
// const DEFAULT_SETTINGS: FormSettings = {
//     mode: "standalone",
//     formName: "Contact form 1",
//     notifyEmail: "mail2deepakrai@gmail.com",

//     fields: [
//         {
//             id: uid(),
//             type: "name",
//             label: "Name",
//             required: true,
//             enabled: true
//         },
//         {
//             id: uid(),
//             type: "last_name",
//             label: "Last name",
//             required: true,
//             enabled: true,
//         },
//         {
//             id: uid(),
//             type: "email",
//             label: "Email",
//             required: true,
//             enabled: true,
//         },
//         {
//             id: uid(),
//             type: "message",
//             label: "Message",
//             required: true,
//             enabled: true,
//         },
//     ],

//     buttonText: "Submit",
//     stretchOnMobile: false,
//     buttonPosition: "center",
//     submitAction: "message",
//     thankYouMessage: "Thank You!",
//     redirectUrl: "",

//     styleElement: "form_fields",
//     styleState: "normal",
//     fillColor: "#FFFFFF",
//     fontFamily: "Poppins",
//     labelTextColor: "#0F172A",
//     labelTextSize: 14,
//     fieldTextColor: "#0F172A",
//     fieldTextSize: 16,
//     borderColor: "#D1D5DB",
//     borderWidth: 1,
//     cornerRadius: 10,
//     spacing: 15,

//     animation: "slide",
// };
type FormSettings = {
    // General
    mode?: FormMode;
    formName?: string;
    notifyEmail?: string;

    // Fields
    fields?: FormField[];

    // Button
    buttonText?: string;
    stretchOnMobile?: boolean;
    buttonPosition?: BtnPos;
    submitAction?: SubmitAction;
    thankYouMessage?: string;
    redirectUrl?: string;

    // Style
    styleElement?: StyleElement;
    styleState?: StyleState;
    fillColor?: string;
    fontFamily?: string;
    labelTextColor?: string;
    labelTextSize?: number;
    fieldTextColor?: string;
    fieldTextSize?: number;
    borderColor?: string;
    borderWidth?: number;
    cornerRadius?: number;
    spacing?: number;

    // Animation
    animation?: Anim;
};

function FieldRow({
    field,
    onToggleEnabled,
    onToggleRequired,
    onRename,
    onMove,
}: {
    field: FormField;
    onToggleEnabled: () => void;
    onToggleRequired: () => void;
    onRename: (v: string) => void;
    onMove: (dir: "up" | "down") => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-white px-3 py-2">
            <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-slate-400" />
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Input
                            value={field.label}
                            onChange={(e) => onRename(e.target.value)}
                            className="h-8 w-[180px] border-transparent bg-transparent px-2 text-sm font-medium focus-visible:ring-0"
                        />
                        {field.required ? (
                            <span className="text-xs text-slate-500">*</span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-slate-600"
                    onClick={onToggleRequired}
                >
                    {field.required ? "Required" : "Optional"}
                    <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                </Button>

                <Switch
                    checked={field.enabled}
                    onCheckedChange={onToggleEnabled}
                    className="data-[state=checked]:bg-[var(--accent)]"
                    style={
                        {
                            ["--accent" as any]: ACCENT,
                        } as React.CSSProperties
                    }
                />

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMove("up")}
                        aria-label="Move up"
                    >
                        ↑
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMove("down")}
                        aria-label="Move down"
                    >
                        ↓
                    </Button>
                </div>
            </div>
        </div>
    );
}


type Props = {
    componentHtml?: string;
}
const CurrentForm = ({ componentHtml }: Props) => {
    console.log("componentHtml", componentHtml)
    const [settings, setSettings] = React.useState<FormSettings|null>(null);

    React.useEffect(() => {
        if (componentHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(componentHtml, "text/html");
            const formGroups = doc.querySelectorAll(".form-group");

            const newFields: FormField[] = [];

            formGroups.forEach((group) => {
                const labelEl = group.querySelector("label");
                const inputEl = group.querySelector("input, textarea");
              
                if (labelEl && inputEl) {
                    const inputlabel = inputEl.getAttribute("name") || "";
                    const inputType = inputEl.getAttribute("type") || "";
                    const inputPlaceholder = inputEl.getAttribute("placeholder") || "";
                    const labelName = labelEl.getAttribute("name") || ""
                    console.log("group", group)
                     console.log("inputlabel", inputlabel)
                     console.log("inputType", inputType)
                     console.log("inputPlaceholder", inputPlaceholder)
                     console.log("labelName", labelName)
                  
                    if (inputlabel && inputType && inputPlaceholder) {
                        const required = inputEl.hasAttribute("required");
                        let label = labelName || "";
                        // Clean label: remove * if present
                        if (label.endsWith("*")) {
                            label = label.slice(0, -1);
                        }

                        newFields.push({
                            id: uid(), // Use HTML ID if available
                            type:inputType,
                            label:inputlabel,
                            inputName:inputlabel,
                            placeholder:inputPlaceholder,
                            required,
                            enabled: true
                        });
                    }
                }
            });

            if (newFields.length > 0) {
                setSettings(prev => ({
                    ...prev,
                    fields: newFields
                }));
            }
        }
    }, [componentHtml]);

    const FIELD_PRESETS: Record<FieldType, Pick<FormField, "label" | "required">> = {
        name: { label: "Name", required: true },
        last_name: { label: "Last name", required: true },
        email: { label: "Email", required: true },
        message: { label: "Message", required: true },
        phone: { label: "Phone", required: false },
        company: { label: "Company", required: false },
        website: { label: "Website", required: false },
    };
    const moveField = (idx: number, dir: "up" | "down") => {
        // setSettings((s) => {
        //     const next = [...s?.fields];
        //     const to = dir === "up" ? idx - 1 : idx + 1;
        //     if (to < 0 || to >= next.length) return s;
        //     const [item] = next.splice(idx, 1);
        //     next.splice(to, 0, item);
        //     return { ...s, fields: next };
        // });
    };

    const addField = (type: FieldType) => {
        const preset = FIELD_PRESETS[type];
        // setSettings((s) => ({
        //     ...s,
        //     fields: [
        //         ...s.fields,
        //         {
        //             id: uid(),
        //             type,
        //             label: preset.label,
        //             required: preset.required,
        //             enabled: true,
        //         },
        //     ],
        // }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Select
                    onValueChange={(v) => addField(v as FieldType)}
                >
                    <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Add new form field" />
                    </SelectTrigger>
                    <SelectContent>
                        {(
                            [
                                "phone",
                                "company",
                                "website",
                            ] as FieldType[]
                        ).map((t) => (
                            <SelectItem key={t} value={t}>
                                {FIELD_PRESETS[t].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                {settings && settings.fields && settings.fields.map((f, idx) => (
                    <FieldRow
                        key={f.id}
                        field={f}
                        onToggleEnabled={() =>
                            setSettings((s) => ({
                                ...s,
                                fields: s?.fields?.map((x) =>
                                    x.id === f.id
                                        ? { ...x, enabled: !x.enabled }
                                        : x
                                ),
                            }))
                        }
                        onToggleRequired={() =>
                            setSettings((s) => ({
                                ...s,
                                fields: s?.fields?.map((x) =>
                                    x.id === f.id
                                        ? { ...x, required: !x.required }
                                        : x
                                ),
                            }))
                        }
                        onRename={(v) =>
                            setSettings((s) => ({
                                ...s,
                                fields: s?.fields?.map((x) =>
                                    x.id === f.id ? { ...x, label: v } : x
                                ),
                            }))
                        }
                        onMove={(dir) => moveField(idx, dir)}
                    />
                ))}
            </div>

            <div className="pt-2 text-xs text-slate-400">
                Tip: You can reorder fields with ↑ ↓ (drag handle is visual).
            </div>
        </div>
    )
}

export default CurrentForm