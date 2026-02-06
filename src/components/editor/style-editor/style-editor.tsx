"use client";

import { ColorPicker } from "@/components/editor/color-picker/color-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { StyleState } from "../../../../types/editor";
import { useState, useEffect, useMemo } from "react";
import GlobalStylesSection from "./GlobalStyle";

import { useEditorContext } from "../EditorContext";
import { Editor } from "grapesjs";
import { parseFontSizeClass } from "./util/style";

/* -----------------------
   Theme utility classes
   - Light: clean whites, slate borders
   - Dark: deep slate, subtle borders
------------------------ */
const UI = {
  panelText: "text-slate-900 dark:text-slate-100 w-full",
  subtleText: "text-slate-600 dark:text-slate-400",

  label: "text-xs font-medium text-slate-700 dark:text-slate-300",
  microLabel: "text-[10px] text-slate-500 dark:text-slate-400",

  input:
    "text-[1.75rem] font-['Outfit,_sans-serif'] font-extrabold tracking-[-0.03em] h-8 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 " +
    "focus-visible:ring-2 focus-visible:ring-violet-500/50 " +
    "dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
  inputTall:
    "text-[1.75rem] font-['Outfit,_sans-serif'] font-extrabold tracking-[-0.03em] h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 " +
    "focus-visible:ring-2 focus-visible:ring-violet-500/50 " +
    "dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",

  selectTrigger:
    "text-xs h-8 bg-white border-slate-200 text-slate-900 " +
    "focus-visible:ring-2 focus-visible:ring-violet-500/50 " +
    "dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100",
  selectContent:
    "bg-white border-slate-200 text-slate-900 shadow-lg w-full" +
    "dark:border-slate-800 dark:bg-black dark:text-slate-100",
  selectItem: "text-xs",

  sectionTitle: "py-2 h-14 text-sm font-medium hover:no-underline",
  accordionItem: "border-slate-200 dark:border-slate-800",

  iconBtnBase:
    "h-8 w-8 border border-slate-200 bg-white text-slate-900 " +
    "hover:bg-slate-50 hover:text-slate-900 " +
    "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  iconBtnActive:
    "bg-violet-600 text-white border-violet-600 " +
    "hover:bg-violet-600 hover:text-white " +
    "dark:bg-violet-500 dark:border-violet-500 dark:text-white dark:hover:bg-violet-500",
};

/* --------------------------
   Common interfaces
--------------------------- */
interface StyleEditorProps {
  styles: StyleState;
  onStyleChange: (property: string, value: string) => void;
  selectedElement?: any;
}
interface SectionProps extends StyleEditorProps {
  elementStyles?: any;
  rootStyles?: any;
}

interface TypographySectionProps {
  styles: StyleState;
  onStyleChange: (property: string, value: string) => void;
  elementStyles: any;
  rootStyles?: any;

}


function TypographySection({ styles, onStyleChange, elementStyles, rootStyles }: TypographySectionProps) {
  return (
    <div className="space-y-4">
      {/* {className && className.length > 0 && (
        <AppliedClassesDisplay classes={className} category="typography" />
      )} */}
      <FontFamilyControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <FontSizeControl styles={styles}
        onStyleChange={onStyleChange}
        elementStyles={elementStyles}

      />
      <FontWeightControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <LineHeightControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <LetterSpacingControl

        styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <TextColorControl
        rootStyles={rootStyles}
        styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <TextAlignmentControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <TextStyleControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <TextShadowControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
    </div>
  );
}

function SpacingSection({ styles, onStyleChange, elementStyles, rootStyles }: SectionProps) {

  console.log("elementStyles", elementStyles);
  console.log("rootStyles", rootStyles);
  return (
    <div className="space-y-3">
      <BorderRadiusControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} rootStyles={rootStyles} />
      <PaddingControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} rootStyles={rootStyles} />
      <MarginControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} rootStyles={rootStyles} />
    </div>
  );
}

function ColorsSection({ styles, onStyleChange, elementStyles, rootStyles }: SectionProps) {
  return (
    <div className="space-y-3">
      <BackgroundColorControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <BorderColorControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <BorderWidthControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
      <BorderStyleControl styles={styles} onStyleChange={onStyleChange} elementStyles={elementStyles} />
    </div>
  );
}



// Typography Controls
function FontFamilyControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const [fontFamilyValue, setFontFamilyValue] = useState<string>(
    elementStyles["font-family"]
  );

  console.log("fontFamilyValue", fontFamilyValue);
  console.log("elementStyles", elementStyles);
  useEffect(() => {
    setFontFamilyValue(elementStyles["font-family"]);
  }, [elementStyles]);

  const handleFontFamily = (data: string) => {
    setFontFamilyValue(data);
    onStyleChange("font-family", data);
  };

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Font Family</Label>
      <Select value={fontFamilyValue} onValueChange={handleFontFamily}>
        <SelectTrigger className={UI.selectTrigger} style={{ width: "100%" }}>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {[
            ["Arial, sans-serif", "Arial"],
            ["Helvetica, sans-serif", "Helvetica"],
            ["Times New Roman, serif", "Times New Roman"],
            ["Georgia, serif", "Georgia"],
            ["Courier New, monospace", "Courier New"],
            ["Verdana, sans-serif", "Verdana"],
            ["Tahoma, sans-serif", "Tahoma"],
            ["Trebuchet MS, sans-serif", "Trebuchet MS"],
            ["Impact, sans-serif", "Impact"],
            ["Comic Sans MS, cursive", "Comic Sans MS"],
            ["Lucida Sans Unicode, sans-serif", "Lucida Sans"],
            ["Palatino Linotype, serif", "Palatino"],
            ["Garamond, serif", "Garamond"],
            ["Bookman, serif", "Bookman"],
            ["Avant Garde, sans-serif", "Avant Garde"],
            ["system-ui, sans-serif", "System UI"],
            ["Inter, sans-serif", "Inter"],
            ["Roboto, sans-serif", "Roboto"],
            ["Open Sans, sans-serif", "Open Sans"],
            ["Lato, sans-serif", "Lato"],
            ["Montserrat, sans-serif", "Montserrat"],
            ["Poppins, sans-serif", "Poppins"],
            ["Outfit, sans-serif", "Outfit"],
          ].map(([value, label]) => (
            <SelectItem key={value} value={value || "Outfit, sans-serif"} className={UI.selectItem}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FontSizeControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const [fontSize, setFontSize] = useState("");


  const getRawValue = () => {
    const rawValue = styles.typography.fontSize || elementStyles["font-size"] || "";
    return rawValue;
  };

  const getFontSizeValue = () =>
    getRawValue().replace("px", "").replace("rem", "").replace("em", "");

  const getFontSizeUnit = () =>
    getRawValue().includes("rem")
      ? "rem"
      : getRawValue().includes("em")
        ? "em"
        : "px";

  const handleValueChange = (value: string) => {
    if (value === "" || !isNaN(Number.parseFloat(value))) {
      const unit = getFontSizeUnit();
      onStyleChange("font-size", `${value}${unit}`);
    }
  };

  const handleUnitChange = (unit: string) => {
    const value = getFontSizeValue();
    onStyleChange("font-size", `${value}${unit}`);
  };

  const handleSliderChange = ([value]: number[]) => {
    const unit = getFontSizeUnit();
    onStyleChange("font-size", `${value}${unit}`);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className={UI.label}>Font Size</Label>
        <div className={"text-xs " + UI.subtleText}>{getRawValue()}</div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={getFontSizeValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          className={UI.inputTall}
          type="number"
          min="0"
          step="1"
        />
        <Select value={getFontSizeUnit()} onValueChange={handleUnitChange}>
          <SelectTrigger className={"w-16 " + UI.selectTrigger}>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent className={UI.selectContent}>
            <SelectItem value="px" className={UI.selectItem}>
              px
            </SelectItem>
            <SelectItem value="rem" className={UI.selectItem}>
              rem
            </SelectItem>
            <SelectItem value="em" className={UI.selectItem}>
              em
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-1">
        <Slider
          value={[Number.parseFloat(getFontSizeValue() || "0")]}
          min={0}
          max={getFontSizeUnit() === "rem" || getFontSizeUnit() === "em" ? 10 : 100}
          step={getFontSizeUnit() === "rem" || getFontSizeUnit() === "em" ? 0.1 : 1}
          onValueChange={handleSliderChange}
        />
      </div>
    </div>
  );
}

function FontWeightControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {


  const [elementfrontWeight, setElementFrontWeight] = useState<string>(elementStyles["font-weight"])
  useEffect(() => {
    setElementFrontWeight(elementStyles["font-weight"])
  }, [elementStyles])
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Font Weight</Label>
      <Select
        value={elementfrontWeight}
        onValueChange={(value) => {
          setElementFrontWeight(value)
          onStyleChange("font-weight", value)
        }}
      >
        <SelectTrigger className={UI.selectTrigger}>
          <SelectValue placeholder="Select weight" />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {[
            ["100", "Thin (100)"],
            ["200", "Extra Light (200)"],
            ["300", "Light (300)"],
            ["400", "Regular (400)"],
            ["500", "Medium (500)"],
            ["600", "Semi Bold (600)"],
            ["700", "Bold (700)"],
            ["800", "Extra Bold (800)"],
            ["900", "Black (900)"],
          ].map(([value, label]) => (
            <SelectItem key={value} value={value} className={UI.selectItem}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function LineHeightControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Line Height</Label>
      <Input
        value={styles.typography.lineHeight || "1.5"}
        onChange={(e) => onStyleChange("line-height", e.target.value)}
        className={UI.input}
        type="number"
        min="0"
        step="0.1"
      />
      <div className="pt-1">
        <Slider
          value={[Number.parseFloat(styles.typography.lineHeight || "1.5")]}
          min={0}
          max={3}
          step={0.1}
          onValueChange={([value]) => onStyleChange("line-height", value.toString())}
        />
      </div>
    </div>
  );
}

function LetterSpacingControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const getLetterSpacingValue = () =>
    (styles.typography.letterSpacing || "0").replace("px", "").replace("em", "");

  const getLetterSpacingUnit = () =>
    styles.typography.letterSpacing && styles.typography.letterSpacing.includes("em")
      ? "em"
      : "px";

  const handleValueChange = (value: string) => {
    onStyleChange("letter-spacing", `${value}${getLetterSpacingUnit()}`);
  };

  const handleUnitChange = (unit: string) => {
    onStyleChange("letter-spacing", `${getLetterSpacingValue()}${unit}`);
  };

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Letter Spacing</Label>
      <div className="flex items-center gap-2">
        <Input
          value={getLetterSpacingValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          className={UI.input}
          type="number"
          step="0.1"
        />
        <Select value={getLetterSpacingUnit()} onValueChange={handleUnitChange}>
          <SelectTrigger className={"w-16 " + UI.selectTrigger}>
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent className={UI.selectContent}>
            <SelectItem value="px" className={UI.selectItem}>
              px
            </SelectItem>
            <SelectItem value="em" className={UI.selectItem}>
              em
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TextColorControl({ styles, onStyleChange, elementStyles, rootStyles }: TypographySectionProps) {
  const colorClasss = elementStyles["color"];
  const extracted = colorClasss?.match(/var\((--[^)]+)\)/)?.[1];

  const color = rootStyles?.[extracted];
  const [textColor, setTextColor] = useState<string>(color)
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Text Color</Label>
      <div className="flex items-center gap-2">
        <ColorPicker
          color={textColor}
          onChange={(color) => {
            setTextColor(color)
            onStyleChange("color", color)
          }}
        />
        <Input
          value={textColor}
          onChange={(e) => {
            setTextColor(e.target.value)
            onStyleChange("color", e.target.value)
          }}
          className={UI.input}
        />
      </div>
    </div>
  );
}

function TextAlignmentControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const active = styles.typography.textAlign;

  const btnClass = (isActive: boolean) =>
    [UI.iconBtnBase, isActive ? UI.iconBtnActive : ""].join(" ");

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Text Alignment</Label>
      <div className="flex gap-1.5">
        <Button
          variant={styles.typography.textAlign === "left" ? "default" : "outline"}
          size="icon"
          onClick={() => onStyleChange("text-align", "left")}
          className={`h-7 w-7 ${styles.typography.textAlign === "left"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={styles.typography.textAlign === "center" ? "default" : "outline"}
          size="icon"
          onClick={() => onStyleChange("text-align", "center")}
          className={`h-7 w-7 ${styles.typography.textAlign === "center"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={styles.typography.textAlign === "right" ? "default" : "outline"}
          size="icon"
          onClick={() => onStyleChange("text-align", "right")}
          className={`h-7 w-7 ${styles.typography.textAlign === "right"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={styles.typography.textAlign === "justify" ? "default" : "outline"}
          size="icon"
          onClick={() => onStyleChange("text-align", "justify")}
          className={`h-7 w-7 ${styles.typography.textAlign === "justify"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

function TextStyleControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const isBold =
    styles.typography.fontWeight === "bold" ||
    Number.parseInt(styles.typography.fontWeight || "0") >= 700;

  const toggleBold = () => onStyleChange("font-weight", isBold ? "normal" : "bold");
  const toggleItalic = () =>
    onStyleChange(
      "font-style",
      styles.typography.fontStyle === "italic" ? "normal" : "italic"
    );
  const toggleUnderline = () =>
    onStyleChange(
      "text-decoration",
      styles.typography.textDecoration === "underline" ? "none" : "underline"
    );
  const toggleUppercase = () =>
    onStyleChange(
      "text-transform",
      styles.typography.textTransform === "uppercase" ? "none" : "uppercase"
    );

  const btnClass = (isActive: boolean) =>
    [UI.iconBtnBase, isActive ? UI.iconBtnActive : ""].join(" ");

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Text Style</Label>

      <div className="flex gap-1.5">
        <Button
          variant={isBold ? "default" : "outline"}
          size="icon"
          onClick={toggleBold}
          className={`h-7 w-7 ${isBold ? "text-white" : "text-black hover:text-black"
            }`}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={styles.typography.fontStyle === "italic" ? "default" : "outline"}
          size="icon"
          onClick={toggleItalic}
          className={`h-7 w-7 ${styles.typography.fontStyle === "italic"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={
            styles.typography.textDecoration === "underline" ? "default" : "outline"
          }
          size="icon"
          onClick={toggleUnderline}
          className={`h-7 w-7 ${styles.typography.textDecoration === "underline"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant={
            styles.typography.textTransform === "uppercase" ? "default" : "outline"
          }
          size="icon"
          onClick={toggleUppercase}
          title="Uppercase"
          className={`h-7 w-7 ${styles.typography.textTransform === "uppercase"
            ? "text-white"
            : "text-black hover:text-black"
            }`}
        >
          <span className="text-xs font-bold">TT</span>
        </Button>
      </div>
    </div>
  );
}

function TextShadowControl({ styles, onStyleChange, elementStyles }: TypographySectionProps) {
  const updateTextShadow = (
    x: string = styles.typography.textShadowX || "0px",
    y: string = styles.typography.textShadowY || "0px",
    blur: string = styles.typography.textShadowBlur || "0px",
    color: string = styles.typography.textShadowColor || "rgba(0,0,0,0.4)"
  ) => {
    onStyleChange("text-shadow", `${x} ${y} ${blur} ${color}`);
  };

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Text Shadow</Label>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className={UI.microLabel}>Horizontal</Label>
          <Input
            value={(styles.typography.textShadowX || "0px").replace("px", "")}
            onChange={(e) => updateTextShadow(`${e.target.value || 0}px`)}
            className={UI.input}
            type="number"
          />
        </div>

        <div>
          <Label className={UI.microLabel}>Vertical</Label>
          <Input
            value={(styles.typography.textShadowY || "0px").replace("px", "")}
            onChange={(e) =>
              updateTextShadow(
                styles.typography.textShadowX || "0px",
                `${e.target.value || 0}px`
              )
            }
            className={UI.input}
            type="number"
          />
        </div>

        <div>
          <Label className={UI.microLabel}>Blur</Label>
          <Input
            value={(styles.typography.textShadowBlur || "0px").replace("px", "")}
            onChange={(e) =>
              updateTextShadow(
                styles.typography.textShadowX || "0px",
                styles.typography.textShadowY || "0px",
                `${e.target.value || 0}px`
              )
            }
            className={UI.input}
            type="number"
            min="0"
          />
        </div>

        <div>
          <Label className={UI.microLabel}>Color</Label>
          <div className="flex items-center gap-1">
            <ColorPicker
              color={styles.typography.textShadowColor || "rgba(0,0,0,0.4)"}
              onChange={(color) =>
                updateTextShadow(
                  styles.typography.textShadowX || "0px",
                  styles.typography.textShadowY || "0px",
                  styles.typography.textShadowBlur || "0px",
                  color
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Spacing Controls
--------------------------- */
function BorderRadiusControl({ styles, onStyleChange }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Border Radius (rem)</Label>
      <Slider
        value={[styles.spacing.borderRadius || 0]}
        max={2}
        step={0.125}
        onValueChange={([value]) => onStyleChange("border-radius", `${value}rem`)}
        className="py-1"
      />
      <div className={"text-right text-[10px] " + UI.subtleText}>
        {styles.spacing.borderRadius || 0}rem
      </div>
    </div>
  );
}

function PaddingControl({ styles, onStyleChange, elementStyles, rootStyles }: SectionProps) {
  const [padding, setPadding] = useState({
    top: "",
    right: "",
    bottom: "",
    left: ""
  });

  // Sync local state with elementStyles in a single update
  useEffect(() => {
    setPadding({
      top: elementStyles["padding-top"]?.replace(/px$/, '') || "",
      right: elementStyles["padding-right"]?.replace(/px$/, '') || "",
      bottom: elementStyles["padding-bottom"]?.replace(/px$/, '') || "",
      left: elementStyles["padding-left"]?.replace(/px$/, '') || ""
    });
  }, [elementStyles]);

  const handlePaddingChange = (side: string, value: string) => {
    // Update local state immediately for responsive UI
    setPadding(prev => ({ ...prev, [side]: value }));
    // Apply style change to the element
    onStyleChange(`padding-${side}`, value ? `${value}px` : "0px");
  };

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Padding</Label>

      <div className="grid grid-cols-2 gap-2">
        {/* Top */}
        <div>
          <Label className={UI.microLabel}>Top</Label>
          <Input
            value={padding.top}
            onChange={(e) => handlePaddingChange("top", e.target.value)}
            className={UI.input}
            type="number"
            min="0"
          />
        </div>

        {/* Right */}
        <div>
          <Label className={UI.microLabel}>Right</Label>
          <Input
            value={padding.right}
            onChange={(e) => handlePaddingChange("right", e.target.value)}
            className={UI.input}
            type="number"
            min="0"
          />
        </div>

        {/* Bottom */}
        <div>
          <Label className={UI.microLabel}>Bottom</Label>
          <Input
            value={padding.bottom}
            onChange={(e) => handlePaddingChange("bottom", e.target.value)}
            className={UI.input}
            type="number"
            min="0"
          />
        </div>

        {/* Left */}
        <div>
          <Label className={UI.microLabel}>Left</Label>
          <Input
            value={padding.left}
            onChange={(e) => handlePaddingChange("left", e.target.value)}
            className={UI.input}
            type="number"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

function MarginControl({ styles, onStyleChange, elementStyles, rootStyles }: SectionProps) {
  const [margin, setMargin] = useState({
    top: "",
    right: "",
    bottom: "",
    left: ""
  });

  // Sync local state with elementStyles in a single update
  useEffect(() => {
    setMargin({
      top: elementStyles["margin-top"]?.replace(/px$/, '') || "",
      right: elementStyles["margin-right"]?.replace(/px$/, '') || "",
      bottom: elementStyles["margin-bottom"]?.replace(/px$/, '') || "",
      left: elementStyles["margin-left"]?.replace(/px$/, '') || ""
    });
  }, [elementStyles]);

  const handleMarginChange = (side: string, value: string) => {
    // Update local state immediately for responsive UI
    setMargin(prev => ({ ...prev, [side]: value }));
    // Apply style change to the element
    onStyleChange(`margin-${side}`, value ? `${value}px` : "0px");
  };

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Margin</Label>

      <div className="grid grid-cols-2 gap-2">
        {/* Top */}
        <div>
          <Label className={UI.microLabel}>Top</Label>
          <Input
            value={margin.top}
            onChange={(e) => handleMarginChange("top", e.target.value)}
            className={UI.input}
            type="number"
          />
        </div>

        {/* Right */}
        <div>
          <Label className={UI.microLabel}>Right</Label>
          <Input
            value={margin.right}
            onChange={(e) => handleMarginChange("right", e.target.value)}
            className={UI.input}
            type="number"
          />
        </div>

        {/* Bottom */}
        <div>
          <Label className={UI.microLabel}>Bottom</Label>
          <Input
            value={margin.bottom}
            onChange={(e) => handleMarginChange("bottom", e.target.value)}
            className={UI.input}
            type="number"
          />
        </div>

        {/* Left */}
        <div>
          <Label className={UI.microLabel}>Left</Label>
          <Input
            value={margin.left}
            onChange={(e) => handleMarginChange("left", e.target.value)}
            className={UI.input}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   Colors Controls
--------------------------- */
function BackgroundColorControl({ styles, onStyleChange, elementStyles, rootStyles }: SectionProps) {
  const colorPresets = [
    { color: "#FFFFFF", name: "White" },
    { color: "#F8FAFC", name: "Slate 50" },
    { color: "#EEF2FF", name: "Indigo 50" },
    { color: "#ECFEFF", name: "Cyan 50" },
    { color: "#0B1220", name: "Deep Dark" },
  ];

  const colorClasss = elementStyles?.["background-color"];
  const extracted = colorClasss?.match(/var\((--[^)]+)\)/)?.[1];

  const color = rootStyles?.[extracted];
  const [backgroundColor, setBackground] = useState<string>(color || styles.colors.backgroundColor)
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Background Color</Label>

      <div className="flex items-center gap-2">
        <ColorPicker
          color={backgroundColor}
          onChange={(color) => {
            setBackground(color)
            onStyleChange("background-color", color)
          }}
        />
        <Input
          value={backgroundColor}
          onChange={(e) => {
            setBackground(e.target.value)
            onStyleChange("background-color", e.target.value)
          }}
          className={UI.input}
        />
      </div>

      <div className="grid grid-cols-5 gap-1 mt-2">
        {colorPresets.map((preset, index) => (
          <button
            key={`bg-${preset.color}-${index}`}
            type="button"
            className="w-full h-7 rounded-md border border-slate-200 dark:border-slate-800"
            style={{ backgroundColor: preset.color }}
            onClick={() => onStyleChange("background-color", preset.color)}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  );
}

function BorderColorControl({ styles, onStyleChange }: SectionProps) {
  const colorPresets = [
    { color: "#E5E7EB", name: "Default" },
    { color: "#CBD5E1", name: "Slate 300" },
    { color: "#A78BFA", name: "Violet" },
    { color: "#22C55E", name: "Green" },
    { color: "#EF4444", name: "Red" },
  ];

  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Border Color</Label>

      <div className="flex items-center gap-2">
        <ColorPicker
          color={styles.colors.borderColor || "#E5E7EB"}
          onChange={(color) => onStyleChange("border-color", color)}
        />
        <Input
          value={styles.colors.borderColor || "#E5E7EB"}
          onChange={(e) => onStyleChange("border-color", e.target.value)}
          className={UI.input}
        />
      </div>

      <div className="grid grid-cols-5 gap-1 mt-2">
        {colorPresets.map((preset, index) => (
          <button
            key={`border-${preset.color}-${index}`}
            type="button"
            className="w-full h-7 rounded-md border border-slate-200 dark:border-slate-800"
            style={{ backgroundColor: preset.color }}
            onClick={() => onStyleChange("border-color", preset.color)}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  );
}

function BorderWidthControl({ styles, onStyleChange }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Border Width</Label>

      <div className="flex items-center gap-2">
        <Input
          value={(styles.colors.borderWidth || "0px")
            .replace("px", "")
            .replace("rem", "")
            .replace("em", "")}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || !isNaN(Number.parseFloat(value))) {
              onStyleChange("border-width", `${value}px`);
            }
          }}
          className={UI.input}
          type="number"
          min="0"
          step="1"
        />
        <div className={"w-16 text-xs text-right " + UI.subtleText}>
          {styles.colors.borderWidth || "0px"}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 mt-2">
        {[
          ["None", "0px"],
          ["Thin", "1px"],
          ["Medium", "2px"],
          ["Thick", "4px"],
        ].map(([label, value]) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800"
            onClick={() => onStyleChange("border-width", value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function BorderStyleControl({ styles, onStyleChange }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Border Style</Label>

      <Select
        value={styles.colors.borderStyle || "solid"}
        onValueChange={(value) => onStyleChange("border-style", value)}
      >
        <SelectTrigger className={UI.selectTrigger}>
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className={UI.selectContent}>
          {[
            ["none", "None"],
            ["solid", "Solid"],
            ["dashed", "Dashed"],
            ["dotted", "Dotted"],
            ["double", "Double"],
          ].map(([value, label]) => (
            <SelectItem key={value} value={value} className={UI.selectItem}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-4 gap-1 mt-2">
        <button
          type="button"
          className="h-8 rounded-md border border-slate-200 text-xs text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => onStyleChange("border-style", "solid")}
        >
          Solid
        </button>
        <button
          type="button"
          className="h-8 rounded-md border border-dashed border-slate-300 text-xs text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => onStyleChange("border-style", "dashed")}
        >
          Dashed
        </button>
        <button
          type="button"
          className="h-8 rounded-md border border-dotted border-slate-300 text-xs text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => onStyleChange("border-style", "dotted")}
        >
          Dotted
        </button>
        <button
          type="button"
          className="h-8 rounded-md border-2 border-double border-slate-300 text-xs text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => onStyleChange("border-style", "double")}
        >
          Double
        </button>
      </div>
    </div>
  );
}

/* --------------------------
   Layout Controls
--------------------------- */
function DisplayStyleControl({ styles, onStyleChange }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <Label className={UI.label}>Display</Label>
      <Select
        value={styles?.layout?.display || "block"}
        onValueChange={(value) => onStyleChange("display", value)}
      >
        <SelectTrigger className={UI.selectTrigger}
          style={{ width: "100%" }}>
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className={UI.selectContent} style={{ width: "100%" }}>
          <SelectItem value="block" className={UI.selectItem}>
            Block
          </SelectItem>
          <SelectItem value="flex" className={UI.selectItem}>
            Flex
          </SelectItem>
          <SelectItem value="none" className={UI.selectItem}>
            None
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/* --------------------------
   Main StyleEditor component
--------------------------- */
export function StyleEditor({ styles, onStyleChange, selectedElement }: StyleEditorProps) {
  const { state } = useEditorContext();
  const editor = state.editor as Editor | null;
  const getRootCSS = editor?.Css.getRule(":root");
  const rootStyles = getRootCSS?.getStyle();
  const tagType = selectedElement?.attributes?.type;
  const getAttributes = selectedElement.getAttributes();
  const classNames: string[] = selectedElement.getClasses();
  console.log("classNames", classNames);

  const [elementStyles, setElementStyles] = useState({});
  console.log("selectedElement", selectedElement);
  useEffect(() => {
    if (editor && selectedElement) {
      const currentClasses = selectedElement.getClasses() || [];
      currentClasses.forEach((className: string) => {
        const rule = editor.Css.getRule(`.${className}`);

        if (rule) {
          // console.log(`Styles for class ".${className}":`, rule.getStyle());
          setElementStyles(rule.getStyle());
        } else {
          console.log(`No rule found for class ".${className}"`);
        }
      });
    }
  }, [editor, selectedElement]);

  console.log("elementStyles", elementStyles);

  const showTypography = [
    "color",
    "font-family",
    "font-size",
    "font-weight",
    "letter-spacing",
  ].some((key) => Object.prototype.hasOwnProperty.call(elementStyles, key));


  return (

    <div>

      <Accordion type="single" collapsible defaultValue="typography" className="w-full">
        {(showTypography || tagType === "text" || tagType === "p" || tagType === "span" || tagType === "h1" || tagType === "h2" || tagType === "h3" || tagType === "h4" || tagType === "h5" || tagType === "h6") && (
          <AccordionItem value="typography" className={UI.accordionItem}>
            <AccordionTrigger className={UI.sectionTitle}>Typography</AccordionTrigger>
            <AccordionContent>
              <TypographySection
                elementStyles={elementStyles}
                rootStyles={rootStyles}

                styles={styles}
                onStyleChange={onStyleChange} />
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="spacing" className={UI.accordionItem}>
          <AccordionTrigger className={UI.sectionTitle}>Spacing</AccordionTrigger>
          <AccordionContent>
            <SpacingSection
              elementStyles={elementStyles}
              rootStyles={rootStyles}
              styles={styles}
              onStyleChange={onStyleChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors" className={UI.accordionItem}>
          <AccordionTrigger className={UI.sectionTitle}>Colors</AccordionTrigger>
          <AccordionContent>
            <ColorsSection styles={styles} onStyleChange={onStyleChange} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="display" className={UI.accordionItem}>
          <AccordionTrigger className={UI.sectionTitle}>Display</AccordionTrigger>
          <AccordionContent>
            <DisplayStyleControl styles={styles} onStyleChange={onStyleChange} />
          </AccordionContent>
        </AccordionItem>


        <AccordionItem value="global" className="border-slate-700">
          <AccordionTrigger className="py-2 h-14 text-sm font-medium hover:no-underline">
            Global Styles
          </AccordionTrigger>
          <AccordionContent>
            <GlobalStylesSection styles={styles} onStyleChange={onStyleChange}
              rootStyles={rootStyles}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}
