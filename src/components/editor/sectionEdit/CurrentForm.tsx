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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


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


type Props = {
    componentHtml?: string;
}
const CurrentForm = ({ componentHtml }: Props) => {

    const [settings, setSettings] = React.useState<FormSettings | null>(null);

    React.useEffect(() => {
        if (componentHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(componentHtml, "text/html");
            const formGroups = doc.querySelectorAll(".form-group");

            const newFields: FormField[] = [];

            formGroups.forEach((group) => {
                const labelEl = group.querySelector("label");
                const inputEl = group.querySelector("input");
                const inputTextEl = group.querySelector("textarea");
                console.log("labelEl--->", labelEl)
                console.log("inputElgroup--->", inputEl)
                console.log("inputTextElgroup--->", inputTextEl)
                if (labelEl && (inputEl || inputTextEl)) {
                    const fieldEl = inputEl || inputTextEl;
                    const inputName = fieldEl?.getAttribute("name") || "";
                    const inputType = inputTextEl ? "textarea" : inputEl?.getAttribute("type") || "text";
                    const inputPlaceholder = fieldEl?.getAttribute("placeholder") || "";
                    let labelText = labelEl.textContent?.trim() || inputName;

                    // Clean label: remove * if present at the end
                    if (labelText.endsWith("*")) {
                        labelText = labelText.slice(0, -1);
                    }

                    if (inputName) {
                        const required = fieldEl?.hasAttribute("required");

                        newFields.push({
                            id: uid(),
                            type: inputType,
                            label: labelText,
                            inputName: inputName,
                            placeholder: inputPlaceholder,
                            required: required ?? false,
                            enabled: true
                        });
                    }
                }
            });

            if (newFields.length > 0) {
                console.log("newFields", newFields)
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
        setSettings((s) => {
            if (!s?.fields) return s;
            const next = [...s.fields];
            const to = dir === "up" ? idx - 1 : idx + 1;
            if (to < 0 || to >= next.length) return s;
            const [item] = next.splice(idx, 1);
            next.splice(to, 0, item);
            return { ...s, fields: next };
        });
    };

    const addField = (type: FieldType) => {
        const preset = FIELD_PRESETS[type];
        setSettings((s) => ({
            ...s,
            fields: [
                ...(s?.fields || []),
                {
                    id: uid(),
                    type,
                    label: preset.label,
                    inputName: type, // Assuming inputName is same as type for new fields
                    placeholder: preset.label, // Assuming placeholder is same as label for new fields
                    required: preset.required,
                    enabled: true,
                },
            ],
        }));
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

            <Accordion type="single" collapsible className="w-full space-y-2">
                {settings && settings.fields && settings.fields.map((f, idx) => (
                    <AccordionItem key={f.id} value={f.id} className="border rounded-xl bg-white px-0 overflow-hidden">
                        <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-slate-50 [&[data-state=open]]:bg-slate-50">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <GripVertical className="h-4 w-4 text-slate-400" />
                                <span>{f.label}</span>
                                {f.required && <span className="text-xs text-red-500">*</span>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3 pt-2 bg-slate-50 border-t">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-xs font-medium text-slate-500">Label</label>
                                    <Input
                                        value={f.label}
                                        onChange={(e) =>
                                            setSettings((s) => ({
                                                ...s,
                                                fields: s?.fields?.map((x) =>
                                                    x.id === f.id ? { ...x, label: e.target.value } : x
                                                ),
                                            }))
                                        }
                                        className="h-8 bg-white"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={f.required}
                                            onCheckedChange={() =>
                                                setSettings((s) => ({
                                                    ...s,
                                                    fields: s?.fields?.map((x) =>
                                                        x.id === f.id
                                                            ? { ...x, required: !x.required }
                                                            : x
                                                    ),
                                                }))
                                            }
                                            id={`required-${f.id}`}
                                            className="data-[state=checked]:bg-[#6D5EF5] relative inline-flex h-[20px] w-[36px] items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <span
                                                className={`${f.required ? 'translate-x-[18px]' : 'translate-x-0.5'
                                                    } pointer-events-none block h-[16px] w-[16px] rounded-full bg-white shadow-lg ring-0 transition-transform`}
                                            />
                                        </Switch>
                                        <label htmlFor={`required-${f.id}`} className="text-sm text-slate-600 cursor-pointer select-none">Required</label>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => { e.stopPropagation(); moveField(idx, "up"); }}
                                            disabled={idx === 0}
                                        >
                                            <span className="sr-only">Move up</span>
                                            <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3"><path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L7.5 3.20711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => { e.stopPropagation(); moveField(idx, "down"); }}
                                            disabled={idx === (settings.fields?.length || 0) - 1}
                                        >
                                            <span className="sr-only">Move down</span>
                                            <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3"><path d="M7.5 11.2071L11.1464 7.56066C11.3417 7.3654 11.6583 7.3654 11.8536 7.56066C12.0488 7.75592 12.0488 8.0725 11.8536 8.26777L7.85355 12.2678C7.65829 12.463 7.34171 12.463 7.14645 12.2678L3.14645 8.26777C2.95118 8.0725 2.95118 7.75592 3.14645 7.56066C3.34171 7.3654 3.65829 7.3654 3.85355 7.56066L7.5 11.2071Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="pt-2 text-xs text-slate-400">
                Tip: You can reorder fields with ↑ ↓ (drag handle is visual).
            </div>
        </div>
    )
}

export default CurrentForm