"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";


// Types and Interfaces
interface AttributesEditorProps {
  selectedElement: any;
  onAttributeChange: (name: string, value: string) => void;
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
      setHtmlContent(selectedElement.getEl().innerHTML);

      const handleChange = () => {
        setHtmlContent(selectedElement.getEl().innerHTML);
      };

      selectedElement.on("change:components", handleChange);
      selectedElement.on("change:content", handleChange);

      return () => {
        selectedElement.off("change:components", handleChange);
        selectedElement.off("change:content", handleChange);
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

    // Log various ways to view the "content"
    // console.group("Selected Element Details");
    // console.log("Model Object:", selectedElement);
    // console.log("HTML String:", selectedElement.to`HTML?.());`
    // console.log("JSON Model:", selectedElement.toJSON?.());
    // console.log("Text Content (if applicable):", selectedElement.get?.("content"));
    // console.log("Live DOM innerHTML:", htmlContent);
    // console.groupEnd();

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

    onAttributeChange(name, value);
  };

  const handleTraitChange = (traitName: string, value: string) => {
    if (!selectedElement) return;

    const trait = selectedElement.getTrait?.(traitName);
    if (!trait) return;

    trait.setValue(value);
    setAttributes((prev) => ({ ...prev, [traitName]: value }));
    onAttributeChange(traitName, value);
  };

  const handleHTMLContentChange = (value: string) => {
    setHtmlContent(value);
    if (selectedElement) {
      selectedElement.components(value);
    }
  };


  if (!selectedElement) {
    return (
      <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
        No element selected. Select an element to edit its attributes.
      </div>
    );
  }

  // Common HTML attributes
  const commonAttributes = [
    { name: "id", label: "ID", type: "text" },
    { name: "class", label: "Class", type: "text" },
    { name: "title", label: "Title", type: "text" },
    // { name: "htmlContent", label: "HTML", type: "textarea" },
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

  // ---------- Theme classes (Light + Dark) ----------
  const sectionTitle =
    "text-sm font-semibold text-slate-900 dark:text-slate-100";
  const labelCls = "text-xs font-medium text-slate-700 dark:text-slate-300";

  const inputCls =
    "h-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 " +
    "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-0 " +
    "dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 " +
    "dark:focus-visible:ring-violet-400";

  const selectCls =
    "w-full h-9 px-3 text-sm rounded-md border bg-white border-slate-200 text-slate-900 " +
    "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 " +
    "dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-100 " +
    "dark:focus:ring-violet-400";

  const cardCls =
    "rounded-lg border bg-white border-slate-200 " +
    "dark:bg-slate-950/20 dark:border-slate-800";

  const dividerCls = "border-slate-200 dark:border-slate-800";

  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Traits */}
      {traits.length > 0 && (
        <div className={`p-4 ${cardCls} space-y-4`}>
          <h3 className={sectionTitle}>Component Settings</h3>

          {traits.map((trait: any) => {
            const traitName = trait.get ? trait.get("name") : trait.name;
            const traitLabel = trait.get ? trait.get("label") : trait.label;
            const traitType = trait.get ? trait.get("type") : trait.type;
            const traitValue = trait.get ? trait.getValue() : trait.value;
            const traitOptions = trait.get
              ? trait.get("options")
              : trait.options;

            return (
              <div key={traitName} className="space-y-2">
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={traitValue === true || traitValue === "true"}
                      onChange={(e) =>
                        handleTraitChange(traitName, String(e.target.checked))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={traitValue || ""}
                    onChange={(e) => handleTraitChange(traitName, e.target.value)}
                    placeholder={
                      trait.get ? trait.get("placeholder") : trait.placeholder
                    }
                    className={inputCls}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Common HTML Attributes */}
      <div className={`p-4 ${cardCls} space-y-4`}>
        <h3 className={sectionTitle}>HTML Attributes</h3>

        {commonAttributes.map((attr) => (
          <div key={attr.name} className="space-y-2">
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
        <Label className={labelCls}>{"HTML content"}</Label>
        <Textarea
          value={htmlContent ?? ""}
          onChange={(e) => handleHTMLContentChange(e.target.value)}
          className={`${inputCls} min-h-[150px] font-mono text-xs`}
          placeholder={`Enter HTML content`}
        />

      </div>

      {/* Element-specific attributes */}
      {elementSpecificAttributes.length > 0 && (
        <div className={`p-4 ${cardCls} space-y-4`}>
          <h3 className={sectionTitle}>
            {(tagName || "ELEMENT").toUpperCase()} Attributes
          </h3>

          {elementSpecificAttributes.map((attr) => (
            <div key={attr.name} className="space-y-2">
              <Label className={labelCls}>{attr.label}</Label>

              {attr.type === "select" ? (
                <select
                  value={attributes[attr.name] || ""}
                  onChange={(e) =>
                    handleAttributeChange(attr.name, e.target.value)
                  }
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
                  onChange={(e) =>
                    handleAttributeChange(attr.name, e.target.value)
                  }
                  className={inputCls}
                  placeholder={`Enter ${attr.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Element info */}
      <div className={`p-4 ${cardCls}`}>
        <div className={`pt-1 border-t ${dividerCls}`} />
        <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span className="font-medium">Element:</span>{" "}
            <span className="text-slate-900 dark:text-slate-200">{tagName}</span>
          </div>
          <div>
            <span className="font-medium">Component ID:</span>{" "}
            <span className="font-mono text-slate-900 dark:text-slate-200">
              {selectedElement.cid}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
