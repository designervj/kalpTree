"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdDragIndicator } from "react-icons/md";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  AlignJustify,
  AlignLeft,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Mail,
  Phone,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { useMemo } from "react";

type FieldKind =
  | "short_answer"
  | "paragraph"
  | "single_choice"
  | "multiple_choice";
type TextInputType = "plain" | "email" | "phone";

type FieldOption = { id: string; label: string };

export interface FormField {
  id: string;
  kind: FieldKind;
  label: string;
  placeholder?: string;
  required: boolean;
  enabled: boolean;
  textType?: TextInputType;
  options?: FieldOption[];
};

type Props = {
  componentHtml?: string;

  // onAddField?: (fields: FormField) => void
};

const uid = () => Math.random().toString(36).slice(2, 10);

const FIELD_META: Record<
  FieldKind,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  short_answer: { label: "Short answer", Icon: AlignLeft },
  paragraph: { label: "Paragraph", Icon: AlignJustify },
  single_choice: { label: "Single choice", Icon: CircleDot },
  multiple_choice: { label: "Multiple choice", Icon: CheckSquare },
};

const DEFAULT_FIELDS: FormField[] = [
  {
    id: uid(),
    kind: "short_answer",
    label: "Name",
    placeholder: "Name",
    required: false,
    enabled: true,
    textType: "plain",
  },
  {
    id: uid(),
    kind: "short_answer",
    label: "Last name",
    placeholder: "Last name",
    required: false,
    enabled: true,
    textType: "plain",
  },
  {
    id: uid(),
    kind: "short_answer",
    label: "Email",
    placeholder: "Email",
    required: true,
    enabled: true,
    textType: "email",
  },
  {
    id: uid(),
    kind: "paragraph",
    label: "Message",
    placeholder: "Message",
    required: false,
    enabled: true,
  },
];

function DragDots() {
  return (
    <div >
      {/* {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-slate-400" />
      ))} */}
      <MdDragIndicator />

    </div>
  );
}

function SortableFieldRow({
  field,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: {
  field: FormField;
  index: number;
  total: number;
  onUpdate: (id: string, patch: Partial<FormField>) => void;
  onRemove: (id: string) => void;
  onMove: (idx: number, dir: "up" | "down") => void;
  onAddOption: (fieldId: string) => void;
  onUpdateOption: (fieldId: string, optId: string, label: string) => void;
  onRemoveOption: (fieldId: string, optId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = FIELD_META[field.kind].Icon;

  // ✅ IMPORTANT: do NOT override listeners.onPointerDown
  const {
    onPointerDown,
    onKeyDown,
    ...restListeners
  } = (listeners ?? {}) as Record<string, any>;

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      value={field.id}
      className={[
        "border-b last:border-b-0",
        isDragging ? "bg-slate-50 shadow-sm" : "bg-white",
      ].join(" ")}
    >
      <AccordionTrigger
        className={[
          "group flex w-full items-center justify-between px-2 py-2 bg-slate-50",
          "hover:no-underline hover:bg-slate-50",
          "[&>svg]:hidden",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          {/* ✅ Drag handle */}
          <span
            ref={setActivatorNodeRef}
            {...attributes}
            {...restListeners}
            onPointerDown={(e: React.PointerEvent) => {
              onPointerDown?.(e);      // let dnd-kit start drag
              e.stopPropagation();     // prevent accordion toggle
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
              onKeyDown?.(e);
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-md",
              "cursor-grab hover:bg-slate-100 active:cursor-grabbing",
              "touch-none select-none", // ✅ helps on touch/trackpad
            ].join(" ")}
            aria-label="Drag to reorder"
            title="Drag to reorder"
          >
            <DragDots />
          </span>

          <Icon className="h-4 w-4 text-slate-800" />
          <span className="text-[15px] font-normal text-slate-900">
            {field.label}
          </span>
        </div>

        <div className="text-slate-500 transition-transform group-data-[state=open]:rotate-180">
          <ChevronDown className="h-4 w-4" />
        </div>
      </AccordionTrigger>


      <AccordionContent className="bg-white px-3 pb-4 pt-2">
        <div className="space-y-5 rounded-md bg-white p-0">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">
              Field label
            </div>
            <Input
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="h-10 rounded-md bg-slate-50"
            />
          </div>

          {(field.kind === "short_answer" || field.kind === "paragraph") && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                Placeholder Text
              </div>
              <Input
                value={field.placeholder || ""}
                onChange={(e) =>
                  onUpdate(field.id, { placeholder: e.target.value })
                }
                className="h-10 rounded-md bg-slate-50"
              />
            </div>
          )}

          {field.kind === "short_answer" && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-900">
                Field type
              </div>

              <Select
                value={field.textType || "plain"}
                onValueChange={(v) =>
                  onUpdate(field.id, { textType: v as TextInputType })
                }
              >
                <SelectTrigger className="h-10 rounded-md bg-white">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Type className="h-4 w-4 text-slate-500" />
                    <SelectValue placeholder="Plain text" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="plain">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Plain text
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(field.kind === "single_choice" || field.kind === "multiple_choice") && (
            <div className="space-y-3">
              {(field.options || []).map((opt) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center">
                    {field.kind === "single_choice" ? (
                      <span className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                    ) : (
                      <span className="h-4 w-4 rounded border border-slate-300 bg-white" />
                    )}
                  </div>

                  <Input
                    value={opt.label}
                    onChange={(e) =>
                      onUpdateOption(field.id, opt.id, e.target.value)
                    }
                    className="h-10 flex-1 rounded-md bg-slate-50"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveOption(field.id, opt.id)}
                    className="h-10 w-10 text-slate-500 hover:bg-slate-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => onAddOption(field.id)}
                className="h-10 w-fit rounded-md border-slate-200 px-5 text-[15px] font-semibold text-violet-600"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add option
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-semibold text-slate-900">
              Field is required
            </div>
            <Switch
              checked={field.required}
              onCheckedChange={(checked) =>
                onUpdate(field.id, { required: checked })
              }
            />
          </div>

          <Button
            type="button"
            onClick={() => onRemove(field.id)}
            className=" w-full rounded-md bg-[#FF4D80] text-base font-semibold hover:bg-[#ff3b73]"
          >
            Remove field
          </Button>

          {/* <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9"
              disabled={index === 0}
              onClick={() => onMove(index, "up")}
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9"
              disabled={index === total - 1}
              onClick={() => onMove(index, "down")}
            >
              Move down
            </Button>
          </div> */}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function CurrentForm() {


  const editorProps = useEditor("gjs-editor");
  const {
    state,
    editForm,
  } = editorProps;

  const [fields, setFields] = React.useState<FormField[]>([]);
  const [openFieldId, setOpenFieldId] = React.useState<string | undefined>(
    undefined
  );

  const componentHtml = useMemo(() => {
    return editForm
  }, [editForm])


  const generateHtml = (currentFields: FormField[]) => {

    if (state.editor) {
      const selected = state.editor.getSelected();
      console.log("selected--->", selected);
      const ccid = selected?.getId();
      console.log("ccid--->", ccid);
   
    let html = `<form class="gjs-form" id="${ccid}">`;
    currentFields.forEach((f) => {
      if (!f.enabled) return;

      const fieldName = f.label.toLowerCase().replace(/\s+/g, "_");
      const requiredAttr = f.required ? "required" : "";
      const labelText = `${f.label}${f.required ? "*" : ""}`;

      html += `
        <div class="form-group">
          <label>${labelText}</label>
          ${f.kind === "paragraph"
          ? `<textarea name="${fieldName}" placeholder="${f.placeholder || ""}" ${requiredAttr} rows="5"></textarea>`
          : f.kind === "short_answer"
            ? `<input type="${f.textType === "email" ? "email" : f.textType === "phone" ? "tel" : "text"}" name="${fieldName}" placeholder="${f.placeholder || ""}" ${requiredAttr} />`
            : f.kind === "single_choice"
              ? `
                <div class="options-group">
                  ${(f.options || [])
                .map(
                  (opt) => `
                    <label class="option-label">
                      <input type="radio" name="${fieldName}" value="${opt.label}" />
                      <span>${opt.label}</span>
                    </label>
                  `
                )
                .join("")}
                </div>
              `
              : f.kind === "multiple_choice"
                ? `
                <div class="options-group">
                  ${(f.options || [])
                  .map(
                    (opt) => `
                    <label class="option-label">
                      <input type="checkbox" name="${fieldName}" value="${opt.label}" />
                      <span>${opt.label}</span>
                    </label>
                  `
                  )
                  .join("")}
                </div>
              `
                : ""
        }
        </div>
      `;
    });
    html += `
      <div class="form-group">
        <button type="submit">Submit</button>
      </div>
    </form>`;
    return html;
  }
  };



  React.useEffect(() => {
    if (!componentHtml) return;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(componentHtml, "text/html");
      const formGroups = doc.querySelectorAll(".form-group");
      console.log("Found formGroups:", formGroups.length);

      const parsed: FormField[] = [];

      formGroups.forEach((group) => {
        const labelEl = group.querySelector("label");
        const textarea = group.querySelector("textarea");
        const input = group.querySelector("input");

        // Skip groups that don't have a label AND an input/textarea (like the submit button group)
        if (!labelEl || (!textarea && !input)) return;

        let labelText = (labelEl.textContent || "").trim();
        const required = labelText.endsWith("*") || (textarea || input)?.hasAttribute("required") || false;
        if (labelText.endsWith("*")) labelText = labelText.slice(0, -1).trim();

        let kind: FieldKind = "short_answer";
        let placeholder = "";
        let textType: TextInputType = "plain";
        let options: FieldOption[] = [];

        if (textarea) {
          kind = "paragraph";
          placeholder = textarea.getAttribute("placeholder") || "";
        } else if (input) {
          const type = input.getAttribute("type");
          if (type === "radio") {
            // Check if this label belongs to a radio group or is a single option
            // In the case of multiple radios, they usually share a name
            kind = "single_choice";
            const radioGroup = group.querySelectorAll('input[type="radio"]');
            radioGroup.forEach((r) => {
              const optLabel = r.parentElement?.textContent?.trim() || (r as HTMLInputElement).value;
              options.push({ id: uid(), label: optLabel });
            });
          } else if (type === "checkbox") {
            kind = "multiple_choice";
            const checkboxGroup = group.querySelectorAll('input[type="checkbox"]');
            checkboxGroup.forEach((c) => {
              const optLabel = c.parentElement?.textContent?.trim() || (c as HTMLInputElement).value;
              options.push({ id: uid(), label: optLabel });
            });
          } else {
            kind = "short_answer";
            placeholder = input.getAttribute("placeholder") || "";
            if (type === "email") textType = "email";
            else if (type === "tel") textType = "phone";
            else textType = "plain";
          }
        }

        const field: FormField = {
          id: uid(),
          kind,
          label: labelText,
          required,
          enabled: true,
          placeholder: (kind === "paragraph" || kind === "short_answer") ? placeholder : undefined,
          textType: kind === "short_answer" ? textType : undefined,
          options: (kind === "single_choice" || kind === "multiple_choice") ? options : undefined,
        };

        parsed.push(field);
      });

      console.log("Parsed fields:", parsed);
      if (parsed.length) setFields(parsed);
    } catch (err) {
      console.error("Parse error:", err);
    }
  }, [componentHtml]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFields((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === String(active.id));
      const newIndex = prev.findIndex((f) => f.id === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const addField = (kind: FieldKind) => {
    const meta = FIELD_META[kind];
    const base: FormField = {
      id: uid(),
      kind,
      label: meta.label,
      placeholder: meta.label,
      required: false,
      enabled: true,
      textType: "plain",
    };

    if (kind === "single_choice" || kind === "multiple_choice") {
      base.options = [
        { id: uid(), label: "Option 1" },
        { id: uid(), label: "Option 2" },
      ];
      delete base.placeholder;
      delete base.textType;
    }

    if (kind === "paragraph") {
      base.placeholder = meta.label;
      delete base.textType;
    }
    // onAddField?.(base);
    setFields((p) => [...p, base]);
    setOpenFieldId(base.id);
  };

  const moveField = (idx: number, dir: "up" | "down") => {
    setFields((prev) => {
      const next = [...prev];
      const to = dir === "up" ? idx - 1 : idx + 1;
      if (to < 0 || to >= next.length) return prev;
      const [it] = next.splice(idx, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const removeField = (id: string) => {
    setFields((p) => p.filter((f) => f.id !== id));
    setOpenFieldId((cur) => (cur === id ? undefined : cur));
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    setFields((p) => p.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const addOption = (fieldId: string) => {
    setFields((p) =>
      p.map((f) => {
        if (f.id !== fieldId) return f;
        const opts = f.options || [];
        return {
          ...f,
          options: [...opts, { id: uid(), label: `Option ${opts.length + 1}` }],
        };
      })
    );
  };

  const updateOption = (fieldId: string, optId: string, label: string) => {
    setFields((p) =>
      p.map((f) => {
        if (f.id !== fieldId) return f;
        return {
          ...f,
          options: (f.options || []).map((o) =>
            o.id === optId ? { ...o, label } : o
          ),
        };
      })
    );
  };

  const removeOption = (fieldId: string, optId: string) => {
    setFields((p) =>
      p.map((f) => {
        if (f.id !== fieldId) return f;
        return { ...f, options: (f.options || []).filter((o) => o.id !== optId) };
      })
    );
  };


  const handleUpdateForm = () => {
    const html = generateHtml(fields);
    console.log("html--->", html);
    if (html) {
      if (state.editor) {
      const selected = state.editor.getSelected();
      console.log("selected--->", selected);
      if (selected) {
        // Since 'html' includes the <form> tag, and 'selected' is the form component,
        // we replace the entire component to avoid nesting and ensure all attributes are updated.
        const newComponent = selected.replaceWith(html);

        // Re-select the new component so the sidebar/editor state remains consistent
        if (newComponent) {
          const toSelect = Array.isArray(newComponent) ? newComponent[0] : newComponent;
          state.editor.select(toSelect);
        }

        console.log("Form saved and updated on canvas");
      }
    }
    }
  }
  return (
    <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-sm">
      <Select onValueChange={(v) => addField(v as FieldKind)}>
        <SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
                <Plus className="h-4 w-4" />
              </span>
              <SelectValue placeholder="Add new form field" />
            </div>
          </div>
        </SelectTrigger>

        <SelectContent className="min-w-[260px]">
          {(Object.keys(FIELD_META) as FieldKind[]).map((k) => {
            const Icon = FIELD_META[k].Icon;
            return (
              <SelectItem key={k} value={k} className="py-2">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-slate-700" />
                  <span>{FIELD_META[k].label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <div className="mt-4 rounded-md border border-slate-200 bg-white">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={openFieldId}
              onValueChange={(v) => setOpenFieldId(v || undefined)}
            >
              {fields.map((f, idx) => (
                <SortableFieldRow
                  key={f.id}
                  field={f}
                  index={idx}
                  total={fields.length}
                  onUpdate={updateField}
                  onRemove={removeField}
                  onMove={moveField}
                  onAddOption={addOption}
                  onUpdateOption={updateOption}
                  onRemoveOption={removeOption}
                />
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      </div>

      <Button
        onClick={handleUpdateForm}
      >
        Update Form
      </Button>
    </div>
  );
}
