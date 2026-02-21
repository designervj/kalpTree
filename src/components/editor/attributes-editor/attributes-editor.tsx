"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

// Types and Interfaces
interface AttributesEditorProps {
  selectedElement: any;
  onAttributeChange?: (name: string, value: string) => void;
}

export function AttributesEditor({
  selectedElement,
  onAttributeChange,
}: AttributesEditorProps) {
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [traits, setTraits] = useState<any[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    if (selectedElement) {
      setHtmlContent(selectedElement.getEl()?.innerHTML || "");

      const handleChange = () => {
        setHtmlContent(selectedElement.getEl()?.innerHTML || "");
      };

      selectedElement.on?.("change:components", handleChange);
      selectedElement.on?.("change:content", handleChange);

      return () => {
        selectedElement.off?.("change:components", handleChange);
        selectedElement.off?.("change:content", handleChange);
      };
    } else {
      setHtmlContent("");
    }
  }, [selectedElement]);

  useEffect(() => {
    if (!selectedElement) {
      setAttributes({});
      setTraits([]);
      return;
    }

    const currentAttrs = selectedElement.getAttributes?.() || {};
    setAttributes(currentAttrs);

    const componentTraits = selectedElement.get?.("traits");
    if (componentTraits && componentTraits.length > 0) {
      setTraits(componentTraits.models || componentTraits);
    } else {
      setTraits([]);
    }
  }, [selectedElement]);

  const handleAttributeChange = (name: string, value: string) => {
    setAttributes((prev) => ({ ...prev, [name]: value }));

    if (selectedElement) {
      const trait = selectedElement.getTrait?.(name);
      if (trait) trait.setValue(value);
    }

    onAttributeChange?.(name, value);
  };

  const handleTraitChange = (traitName: string, value: string) => {
    if (!selectedElement) return;

    const trait = selectedElement.getTrait?.(traitName);
    if (!trait) return;

    trait.setValue(value);
    setAttributes((prev) => ({ ...prev, [traitName]: value }));
    onAttributeChange?.(traitName, value);
  };

  const handleHTMLContentChange = (value: string) => {
    setHtmlContent(value);
    if (selectedElement) {
      selectedElement.components?.(value);
    }
  };

  if (!selectedElement) {
    return (
      <div className="rounded-md border border-[#d8dee8] bg-white p-4 text-sm text-[#5f6b7a]">
        No element selected. Select an element to edit its attributes.
      </div>
    );
  }

  // Common HTML attributes
  const commonAttributes = [
    { name: "id", label: "ID", type: "text" },
    { name: "class", label: "Class", type: "text" },
    { name: "title", label: "Title", type: "text" },
  ];

  // Element-specific attributes
  const tagName = selectedElement.get?.("tagName")?.toLowerCase();
  const elementSpecificAttributes: Array<{
    name: string;
    label: string;
    type: "text" | "select";
  }> = [];

  if (tagName === "a") {
    elementSpecificAttributes.push(
      { name: "href", label: "URL", type: "text" },
      { name: "target", label: "Target", type: "select" }
    );
  } else if (tagName === "img") {
    elementSpecificAttributes.push(
      { name: "src", label: "Source URL", type: "text" },
      { name: "alt", label: "Alt Text", type: "text" }
    );
  } else if (tagName === "input") {
    elementSpecificAttributes.push(
      { name: "type", label: "Type", type: "text" },
      { name: "name", label: "Name", type: "text" },
      { name: "placeholder", label: "Placeholder", type: "text" },
      { name: "value", label: "Value", type: "text" }
    );
  } else if (tagName === "button") {
    elementSpecificAttributes.push(
      { name: "type", label: "Type", type: "select" },
      { name: "name", label: "Name", type: "text" }
    );
  } else if (tagName === "form") {
    elementSpecificAttributes.push(
      { name: "action", label: "Action", type: "text" },
      { name: "method", label: "Method", type: "select" }
    );
  }

  // ===== UI Styles (matched to screenshot style) =====
  const panelCls = "space-y-4 rounded-md border border-[#e1e6ef] bg-white p-4";

  const panelTitleWrap = "flex items-center justify-between";
  const panelTitle = "text-sm font-semibold text-[#253a57]";
  const panelChip =
    "inline-flex items-center rounded-md border border-[#dbe3ef] bg-[#f8fbff] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#6b7a90]";

  const labelCls = "text-[13px] font-medium text-[#2f4666]";

  const inputCls =
    "h-10 rounded-md border border-[#d8e0ec] bg-white px-3 text-sm text-[#213042] shadow-none " +
    "placeholder:text-[#9aa8bb] " +
    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b9c7db]";

  const textareaCls =
    "min-h-[140px] rounded-md border border-[#d8e0ec] bg-white px-3 py-2 text-sm text-[#213042] " +
    "placeholder:text-[#9aa8bb] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#b9c7db]";

  const selectCls =
    "w-full h-10 rounded-md border border-[#d8e0ec] bg-white px-3 text-sm text-[#213042] shadow-none " +
    "focus:outline-none focus:ring-0 focus:border-[#b9c7db]";

  const fieldWrap = "space-y-1.5";
  const grid2 = "grid grid-cols-1 gap-3";
  const subCardCls = "space-y-1.5";
  const dividerCls = "border-[#e5eaf2]";

  return (
    <div className="space-y-4">
      {/* Traits */}
      {traits.length > 0 && (
        <div className={panelCls}>
          <div className={panelTitleWrap}>
            <h3 className={panelTitle}>Component Settings</h3>
            <span className={panelChip}>Traits</span>
          </div>

          <div className="space-y-3">
            {traits.map((trait: any) => {
              const traitName = trait.get ? trait.get("name") : trait.name;
              const traitLabel = trait.get ? trait.get("label") : trait.label;
              const traitType = trait.get ? trait.get("type") : trait.type;
              const traitValue = trait.get ? trait.getValue() : trait.value;
              const traitOptions = trait.get ? trait.get("options") : trait.options;

              return (
                <div key={traitName} className={subCardCls}>
                  <Label className={labelCls}>{traitLabel || traitName}</Label>

                  {traitType === "select" ? (
                    <select
                      value={traitValue || ""}
                      onChange={(e) => handleTraitChange(traitName, e.target.value)}
                      className={selectCls}
                    >
                      {traitOptions?.map((option: any) => (
                        <option
                          key={option.id || option.value}
                          value={option.id || option.value}
                        >
                          {option.name || option.label}
                        </option>
                      ))}
                    </select>
                  ) : traitType === "number" ? (
                    <Input
                      type="number"
                      value={traitValue || ""}
                      onChange={(e) => handleTraitChange(traitName, e.target.value)}
                      min={trait.get ? trait.get("min") : trait.min}
                      max={trait.get ? trait.get("max") : trait.max}
                      className={inputCls}
                    />
                  ) : traitType === "checkbox" ? (
                    <div className="flex h-10 items-center rounded-md border border-[#d8e0ec] bg-white px-3">
                      <input
                        type="checkbox"
                        checked={traitValue === true || traitValue === "true"}
                        onChange={(e) =>
                          handleTraitChange(traitName, String(e.target.checked))
                        }
                        className="h-4 w-4 rounded border-[#c7d2e3]"
                      />
                      <span className="ml-2 text-sm text-[#4b5f79]">Enabled</span>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={traitValue || ""}
                      onChange={(e) => handleTraitChange(traitName, e.target.value)}
                      placeholder={trait.get ? trait.get("placeholder") : trait.placeholder}
                      className={inputCls}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Common HTML Attributes */}
      <div className={panelCls}>
        <div className={panelTitleWrap}>
          <h3 className={panelTitle}>HTML Attributes</h3>
          <span className={panelChip}>Core</span>
        </div>

        <div className={grid2}>
          {commonAttributes.map((attr) => (
            <div key={attr.name} className={fieldWrap}>
              <Label className={labelCls}>{attr.label}</Label>
              <Input
                type={attr.type}
                value={attributes[attr.name] || ""}
                onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                className={inputCls}
                placeholder={`Enter ${attr.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="pt-1">
          <div className={fieldWrap}>
            <Label className={labelCls}>HTML Content</Label>
            <Textarea
              value={htmlContent ?? ""}
              onChange={(e) => handleHTMLContentChange(e.target.value)}
              className={`${textareaCls} resize-y font-mono text-xs leading-5`}
              placeholder="Enter HTML content"
            />
          </div>
        </div>
      </div>

      {/* Element-specific attributes */}
      {elementSpecificAttributes.length > 0 && (
        <div className={panelCls}>
          <div className={panelTitleWrap}>
            <h3 className={panelTitle}>
              {(tagName || "ELEMENT").toUpperCase()} Attributes
            </h3>
            <span className={panelChip}>{tagName}</span>
          </div>

          <div className="space-y-3">
            {elementSpecificAttributes.map((attr) => (
              <div key={attr.name} className={subCardCls}>
                <Label className={labelCls}>{attr.label}</Label>

                {attr.type === "select" ? (
                  <select
                    value={attributes[attr.name] || ""}
                    onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                    className={selectCls}
                  >
                    {attr.name === "target" ? (
                      <>
                        <option value="">Default</option>
                        <option value="_blank">New Tab (_blank)</option>
                        <option value="_self">Same Tab (_self)</option>
                        <option value="_parent">Parent (_parent)</option>
                        <option value="_top">Top (_top)</option>
                      </>
                    ) : attr.name === "type" && tagName === "button" ? (
                      <>
                        <option value="button">Button</option>
                        <option value="submit">Submit</option>
                        <option value="reset">Reset</option>
                      </>
                    ) : attr.name === "method" ? (
                      <>
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                      </>
                    ) : null}
                  </select>
                ) : (
                  <Input
                    type="text"
                    value={attributes[attr.name] || ""}
                    onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                    className={inputCls}
                    placeholder={`Enter ${attr.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Element info */}
      <div className={panelCls}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={panelTitle}>Element Info</h3>
          <span className={panelChip}>Read Only</span>
        </div>

        <div className={`mb-3 border-t ${dividerCls}`} />

        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-md border border-[#e1e7f0] bg-[#fafcff] p-3">
            <div className="mb-1 text-[11px] font-medium text-[#647793]">Element</div>
            <div className="text-sm font-semibold text-[#213042]">{tagName}</div>
          </div>

          <div className="rounded-md border border-[#e1e7f0] bg-[#fafcff] p-3">
            <div className="mb-1 text-[11px] font-medium text-[#647793]">Component ID</div>
            <div className="break-all font-mono text-xs text-[#213042]">
              {selectedElement.cid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}