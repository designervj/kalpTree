import React, { useEffect } from 'react'
import { StyleState } from '../../../../types/editor';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '../color-picker/color-picker';
import { Input } from '@/components/ui/input';
import { useEditorContext } from '../EditorContext';

type SectionProps = {

  onStyleChange: (property: string, value: string) => void;
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalStyleModel, transformRawToGlobalStyleModel } from './GlobalStyelModel';

const GlobalStylesSection = ({ onStyleChange }: SectionProps) => {
  const { state } = useEditorContext();
  const [currentStyle, setCurrentStyle] = React.useState<GlobalStyleModel | null>(null);

  // Get global styles from canvas document
  const canvasDoc = state.editor?.Canvas?.getDocument();
  const globalStylesRaw = canvasDoc?.querySelector('[data-global-styles="true"]')?.innerHTML || "";

  useEffect(() => {
    const updatedStyle = transformRawToGlobalStyleModel(globalStylesRaw);
    setCurrentStyle(updatedStyle);
  }, [globalStylesRaw]);

  const stripUnit = (val: string | number) => {
    const strVal = val?.toString() || "";
    return strVal.replace(/[^\d.]/g, '');
  };

  const ColorInput = ({ label, property, value }: { label: string, property: string, value: string }) => (
    <div className="space-y-1.5 px-1">
      <Label className="text-[11px] font-medium text-slate-400">{label}</Label>
      <div className="flex items-center gap-2">
        <ColorPicker
          color={value}
          onChange={(color) => onStyleChange(property, color)}
        />
        <Input
          value={value}
          onChange={(e) => onStyleChange(property, e.target.value)}
          className="flex-1 text-[11px] h-7 dark:bg-slate-800/50 dark:border-slate-700/50 font-mono"
        />
      </div>
      <div className="text-[9px] text-indigo-400/70 font-medium ml-1">editable</div>
    </div>
  );

  const StyleInput = ({ label, property, value, type = "text", unit = "" }: { label: string, property: string, value: string | number, type?: string, unit?: string }) => (
    <div className="space-y-1.5 px-1">
      <Label className="text-[11px] font-medium text-slate-400">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          value={type === "number" ? stripUnit(value.toString()) : value}
          onChange={(e) => onStyleChange(property, type === "number" ? `${e.target.value}${unit}` : e.target.value)}
          className="flex-1 text-[11px] h-7 dark:bg-slate-800/50 dark:border-slate-700/50"
          type={type}
        />
        {unit && <span className="text-[10px] text-slate-500 w-4">{unit}</span>}
      </div>
      <div className="text-[9px] text-indigo-400/70 font-medium ml-1">editable</div>
    </div>
  );

  if (!currentStyle) return null;

  return (
    <ScrollArea className="h-[calc(100vh-140px)] -mx-3 px-3">
      <Accordion type="multiple" defaultValue={["brand"]} className="space-y-2 pb-6">

        {/* Brand Core */}
        <AccordionItem value="brand" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Brand Core</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <ColorInput label="Primary" property="--primary" value={currentStyle.brand.primary} />
            <ColorInput label="Secondary" property="--secondary" value={currentStyle.brand.secondary} />
            <ColorInput label="Accent" property="--accent" value={currentStyle.brand.accent} />
            <ColorInput label="Dark" property="--dark" value={currentStyle.brand.dark} />
            <ColorInput label="Ring" property="--ring" value={currentStyle.brand.ring} />
          </AccordionContent>
        </AccordionItem>

        {/* Fonts */}
        <AccordionItem value="fonts" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Typography Setup</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <StyleInput label="Body Font" property="--font-body" value={currentStyle.fonts.body} />
            <StyleInput label="Heading Font" property="--font-heading" value={currentStyle.fonts.heading} />
            <StyleInput label="Button Font" property="--font-button" value={currentStyle.fonts.button} />
          </AccordionContent>
        </AccordionItem>

        {/* Headings */}
        <AccordionItem value="headings" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Headings (h1-h6)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {[1, 2, 3, 4, 5, 6].map(num => {
              const hKey = `h${num}` as keyof typeof currentStyle.headings;
              const h = currentStyle.headings[hKey];
              return (
                <div key={num} className="space-y-2 border-b border-white/5 pb-3 last:border-0">
                  <div className="text-[10px] font-bold text-indigo-400 mb-1">HEADING (H{num})</div>
                  <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Size" property={`--h${num}-size`} value={h.size} type="number" unit="px" />
                    <StyleInput label="Weight" property={`--h${num}-weight`} value={h.weight} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <StyleInput label="Line Height" property={`--h${num}-lh`} value={h.lineHeight} />
                    <StyleInput label="Letter Spacing" property={`--h${num}-ls`} value={h.letterSpacing} />
                  </div>
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Body */}
        <AccordionItem value="body" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Body Settings</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <StyleInput label="Size" property="--body-size" value={currentStyle.body.size} type="number" unit="px" />
              <StyleInput label="Weight" property="--body-weight" value={currentStyle.body.weight} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StyleInput label="Line Height" property="--body-lh" value={currentStyle.body.lineHeight} />
              <StyleInput label="Letter Spacing" property="--body-ls" value={currentStyle.body.letterSpacing} />
            </div>
            <StyleInput label="Max Width" property="--body-maxw" value={currentStyle.body.maxWidth} />
            <StyleInput label="Paragraph Gap" property="--body-paragraph-gap" value={currentStyle.body.paragraphGap} type="number" unit="px" />
          </AccordionContent>
        </AccordionItem>

        {/* Buttons */}
        <AccordionItem value="buttons" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Buttons (Base)</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <StyleInput label="Base Size" property="--btn-size" value={currentStyle.buttons.base.size} type="number" unit="px" />
              <StyleInput label="Radius" property="--btn-radius" value={currentStyle.buttons.base.radius} type="number" unit="px" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StyleInput label="Height" property="--btn-height" value={currentStyle.buttons.base.height} type="number" unit="px" />
              <StyleInput label="Transition" property="--btn-transition" value={currentStyle.buttons.base.transition} />
            </div>

            <Tabs defaultValue="primary" className="mt-2">
              <TabsList className="w-full h-8 bg-slate-900 border border-slate-800">
                <TabsTrigger value="primary" className="text-[10px] flex-1">Primary</TabsTrigger>
                <TabsTrigger value="secondary" className="text-[10px] flex-1">Sec</TabsTrigger>
                <TabsTrigger value="outline" className="text-[10px] flex-1">Out</TabsTrigger>
              </TabsList>
              {(['primary', 'secondary', 'outline'] as const).map(type => (
                <TabsContent key={type} value={type} className="space-y-3 pt-2 border border-slate-800/50 p-2 rounded-md bg-slate-900/40">
                  <ColorInput label="Background" property={`--btn-${type}-bg`} value={currentStyle.buttons[type].bg} />
                  <ColorInput label="Text" property={`--btn-${type}-text`} value={currentStyle.buttons[type].text} />
                  <ColorInput label="Border" property={`--btn-${type}-border`} value={currentStyle.buttons[type].border} />
                  <div className="pt-1 border-t border-white/5">
                    <ColorInput label="Hover BG" property={`--btn-${type}-hover-bg`} value={currentStyle.buttons[type].hoverBg} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </AccordionContent>
        </AccordionItem>

        {/* Themes */}
        <AccordionItem value="themes" className="border-slate-800">
          <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2">Theme Mode Colors</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Tabs defaultValue="light">
              <TabsList className="w-full h-8 bg-slate-900 border border-slate-800">
                <TabsTrigger value="light" className="text-[10px] flex-1">Light Theme</TabsTrigger>
                <TabsTrigger value="dark" className="text-[10px] flex-1">Dark Theme</TabsTrigger>
              </TabsList>
              <div className="mt-4 p-2 rounded bg-indigo-500/5 border border-indigo-500/20 text-[10px] text-slate-400 mb-2">
                Note: Updating colors here will update variables for each theme.
              </div>

              <TabsContent value="light" className="space-y-3">
                <ColorInput label="Background" property="--bg" value={currentStyle.themes.light.bg} />
                <ColorInput label="Surface" property="--surface" value={currentStyle.themes.light.surface} />
                <ColorInput label="Text" property="--text" value={currentStyle.themes.light.text} />
                <ColorInput label="Muted Text" property="--muted-text" value={currentStyle.themes.light.mutedText} />
                <ColorInput label="Border" property="--border" value={currentStyle.themes.light.border} />
              </TabsContent>

              <TabsContent value="dark" className="space-y-3">
                <ColorInput label="Background" property="--bg-dark" value={currentStyle.themes.dark.bg} />
                <ColorInput label="Surface" property="--surface-dark" value={currentStyle.themes.dark.surface} />
                <ColorInput label="Text" property="--text-dark" value={currentStyle.themes.dark.text} />
                <ColorInput label="Muted Text" property="--muted-text-dark" value={currentStyle.themes.dark.mutedText} />
                <ColorInput label="Border" property="--border-dark" value={currentStyle.themes.dark.border} />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="text-[10px] text-slate-500 mt-2 p-2 bg-indigo-500/5 border border-indigo-500/10 rounded mb-4">
        💡 Real-time synchronization active. Variables are applied to all elements and child components instantly.
      </div>
    </ScrollArea>
  );
}

export default GlobalStylesSection
