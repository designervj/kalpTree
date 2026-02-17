import { Button } from '@/components/ui/button';
import React, { useEffect, useMemo, useState } from 'react'
import { Code2, Eye, Moon, Sun } from 'lucide-react';
import ColorControl from './ColorControl';
import { Card, CardContent } from '@/components/ui/card';
import { mixHex, rgba } from '../util/ColorFunction';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import HeadingControl from './HeadingControl';
import { BodyStyle, BrandColors, BtnKey, ButtonBaseStyle, ButtonColors, HeadingKey, HeadingStyle, LeftTab } from '../GlobalStyleModal';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import BodyControl from './BodyControl';
import ButtonControl from './ButtonControl';

function isHexColor(v: string) {
  return /^#([0-9a-fA-F]{6})$/.test(v.trim());
}

const ShowStyle = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [leftTab, setLeftTab] = useState<LeftTab>("colors");
  const [rightPanel, setRightPanel] = useState<"preview" | "root">("preview");

  const { currentStyle } = useSelector((state: RootState) => state.globalStyle)
  const [globalFontFamily, setGlobalFontFamily] = useState("Inter");
  const [headingFontFamily, setHeadingFontFamily] = useState("Inter");
  const [brand, setBrand] = useState<BrandColors>();
  const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>()

  const [body, setBody] = useState<BodyStyle>();

  const [selectedBtn, setSelectedBtn] = useState<BtnKey>("primary");

  const [buttonBase, setButtonBase] = useState<ButtonBaseStyle>({
    fontFamily: "Inter",
    sizePx: 14,
    weight: 600,
    letterSpacingEm: 0,
    transform: "none",
    radiusPx: 12,
    heightPx: 40,
    paddingXPx: 16,
    borderWidthPx: 1,
    shadow: "none",
    transitionMs: 160,
  });

  const [buttonColors, setButtonColors] = useState<Record<BtnKey, ButtonColors>>();


  useEffect(() => {
    if (currentStyle && currentStyle.globalStyle) {
      const getVal = (prop: string) => {
        const regex = new RegExp(`--${prop}:\\s*([^;]+);`);
        const match = currentStyle?.globalStyle?.match(regex);
        return match ? match[1].trim() : "";
      };

      setBrand((prev) => ({
        primary: getVal("primary"),
        secondary: getVal("secondary"),
        accent: getVal("accent"),
        dark: getVal("dark"),
        text: getVal("text"),
        mutedText: getVal("muted-text"),
        border: getVal("border"),
        ring: getVal("ring"),
      }));

      setHeadings((prev) => ({
        h1: {
          scale: parseFloat(getVal("h1-scale")),
          weight: parseInt(getVal("h1-weight")),
          lineHeight: parseFloat(getVal("h1-lh")),
          letterSpacingEm: parseFloat(getVal("h1-ls")),
        },
        h2: {
          scale: parseFloat(getVal("h2-scale")),
          weight: parseInt(getVal("h2-weight")),
          lineHeight: parseFloat(getVal("h2-lh")),
          letterSpacingEm: parseFloat(getVal("h2-ls")),
        },
        h3: {
          scale: parseFloat(getVal("h3-scale")),
          weight: parseInt(getVal("h3-weight")),
          lineHeight: parseFloat(getVal("h3-lh")),
          letterSpacingEm: parseFloat(getVal("h3-ls")),
        },
        h4: {
          scale: parseFloat(getVal("h4-scale")),
          weight: parseInt(getVal("h4-weight")),
          lineHeight: parseFloat(getVal("h4-lh")),
          letterSpacingEm: parseFloat(getVal("h4-ls")),
        },
        h5: {
          scale: parseFloat(getVal("h5-scale")),
          weight: parseInt(getVal("h5-weight")),
          lineHeight: parseFloat(getVal("h5-lh")),
          letterSpacingEm: parseFloat(getVal("h5-ls")),
        },
        h6: {
          scale: parseFloat(getVal("h6-scale")),
          weight: parseInt(getVal("h6-weight")),
          lineHeight: parseFloat(getVal("h6-lh")),
          letterSpacingEm: parseFloat(getVal("h6-ls")),
        },
      }));
      setHeadingFontFamily(getVal("font-heading"));

      // setBody({
      //   sizePx: parseInt(getVal("body-size")),
      //   weight: parseInt(getVal("body-weight")),
      //   lineHeight: parseFloat(getVal("body-lh")),
      //   letterSpacingEm: parseFloat(getVal("body-ls")),
      //   maxWidthCh: parseInt(getVal("body-maxw")),
      //   paragraphGapPx: parseInt(getVal("body-paragraph-gap")),
      // });

      setButtonBase({
        fontFamily: getVal("font-button"),
        sizePx: parseInt(getVal("btn-size")),
        weight: parseInt(getVal("btn-weight")),
        letterSpacingEm: parseFloat(getVal("btn-ls")),
        transform: getVal("btn-transform") as any,
        radiusPx: parseInt(getVal("btn-radius")),
        heightPx: parseInt(getVal("btn-height")),
        paddingXPx: parseInt(getVal("btn-pad-x")),
        borderWidthPx: parseInt(getVal("btn-border-w")),
        shadow: (getVal("btn-shadow") === "none" ? "none" : "sm") as any, // Simple mapping for now
        transitionMs: parseInt(getVal("btn-transition")),
      });

      // setButtonColors({
      //   primary: {
      //     bg: getVal("btn-primary-bg"),
      //     text: getVal("btn-primary-text"),
      //     border: getVal("btn-primary-border"),
      //     hoverBg: getVal("btn-primary-hover-bg"),
      //     hoverText: getVal("btn-primary-hover-text"),
      //     hoverBorder: getVal("btn-primary-hover-border"),
      //   },
      //   secondary: {
      //     bg: getVal("btn-secondary-bg"),
      //     text: getVal("btn-secondary-text"),
      //     border: getVal("btn-secondary-border"),
      //     hoverBg: getVal("btn-secondary-hover-bg"),
      //     hoverText: getVal("btn-secondary-hover-text"),
      //     hoverBorder: getVal("btn-secondary-hover-border"),
      //   },
      //   outline: {
      //     bg: getVal("btn-outline-bg"),
      //     text: getVal("btn-outline-text"),
      //     border: getVal("btn-outline-border"),
      //     hoverBg: getVal("btn-outline-hover-bg"),
      //     hoverText: getVal("btn-outline-hover-text"),
      //     hoverBorder: getVal("btn-outline-hover-border"),
      //   },
      // });

      setGlobalFontFamily(getVal("font-body"));
    }
  }, [currentStyle]);
  /* ✅ computed palette for this preview (not user editable) */
  const uiPalette = useMemo(() => {
    const light = {
      bg: "#F4F6F5",
      surface: "#FFFFFF",
      text: brand?.text,
      mutedText: brand?.mutedText,
      border: brand?.border,
    };
    const dark = {
      bg: "#071B14",
      surface: "#0B2A1F",
      text: "#EAF7F0",
      mutedText: mixHex("#EAF7F0", "#000000", 0.35),
      border: rgba("#B9F3D5", 0.22),
    };
    return mode === "light" ? light : dark;
  }, [mode, brand?.text, brand?.mutedText, brand?.border]);

  const onLeftTab = (tab: LeftTab) => {
    setLeftTab(tab);
    // setRightPanel("preview");
  };
  const handleSectionColorChange = (v: Partial<BrandColors>) => {
    setBrand((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...v,
      };
    });
  };

  console.log("headings", headings)

  const [selectedHeading, setSelectedHeading] = useState<HeadingKey>("h1");

  const handleHeadingChange = (patch: Partial<HeadingStyle>) => {
    setHeadings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [selectedHeading]: { ...prev[selectedHeading], ...patch },
      };
    });
  };

  /* ❌ Removed bodyControls and buttonControls useMemo blocks as they are now separate components */
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* TOP BAR */}
      <div className="flex justify-between items-center gap-3">
        <div className="grid grid-cols-4 gap-2">
          <Button variant={leftTab === "colors" ? "default" : "outline"}
            onClick={() => onLeftTab("colors")}>
            Colors
          </Button>
          <Button variant={leftTab === "headings" ? "default" : "outline"}
            onClick={() => onLeftTab("headings")}>
            Headings
          </Button>
          <Button variant={leftTab === "body" ? "default" : "outline"}
            onClick={() => onLeftTab("body")}>
            Body
          </Button>
          <Button variant={leftTab === "buttons" ? "default" : "outline"}
            onClick={() => onLeftTab("buttons")}>
            Buttons
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Light/Dark mode toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
            className="gap-2"
            title="Toggle Light/Dark"
          >
            {mode === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {mode === "light" ? "Light" : "Dark"}
          </Button>

          <Button
            size="sm"
            variant={rightPanel === "preview" ? "secondary" : "ghost"}
            onClick={() => {
              setRightPanel("preview");
              // ✅ requested: preview click -> typography show
              setLeftTab("headings");
            }}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          <Button
            size="sm"
            variant={rightPanel === "root" ? "secondary" : "ghost"}
            onClick={() => setRightPanel("root")}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Root File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-4 space-y-6">
          {leftTab === "colors" &&
            brand &&
            <ColorControl
              brand={brand}
              setBrand={setBrand}
              uiPalette={uiPalette}
              setC={(v) => handleSectionColorChange(v)}
              setButtonColors={setButtonColors}
            />

          }
          {leftTab === "headings" && headings && <HeadingControl
            headings={headings}
            headingFontFamily={headingFontFamily ?? ""}
            setHeadingFontFamily={(value) => setHeadingFontFamily(value)}
            setH={(value) => handleHeadingChange(value)}
            selectedHeading={selectedHeading}
            setSelectedHeading={setSelectedHeading}
          />}
          {/* {leftTab === "body" && <BodyControl
            body={body}
            setBody={(patch) => setBody((p) => ({ ...p, ...patch }))}
            globalFontFamily={globalFontFamily}
            setGlobalFontFamily={setGlobalFontFamily}
          />} */}
          {/* {leftTab === "buttons" && <ButtonControl
            buttonBase={buttonBase}
            setButtonBase={(patch) => setButtonBase((p) => ({ ...p, ...patch }))}
            buttonColors={buttonColors}
            setButtonColors={setButtonColors}
            selectedBtn={selectedBtn}
            setSelectedBtn={setSelectedBtn}
          />} */}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-8">
          <Card className="h-full min-h-[580px] border-2 border-muted/40">
            <div className="border-b p-2 flex items-center justify-end gap-2 rounded-t-lg">
              {rightPanel === "root" && (
                null
                // <Button size="sm" variant="outline" onClick={handleCopyRoot} className="gap-2">
                //   {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                //   {copied ? "Copied" : "Copy"}
                // </Button>
              )}
            </div>

            {rightPanel === "preview" ? (
              null
              // <CardContent className="p-6 md:p-8" style={outerPreviewStyle}>
              //   {RightPreviewContent}
              // </CardContent>
            ) : (
              <CardContent className="p-6">
                <div className="mb-3">
                  <p className="text-sm font-semibold">Root File Code (LIVE)</p>
                  <p className="text-xs text-muted-foreground">
                    Light/Dark have separate variables via <span className="font-mono">:root[data-theme="..."]</span>. Gradient removed (solid hero).
                  </p>
                </div>
                <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-auto max-h-[520px]">
                  <code>{currentStyle?.globalStyle}</code>
                </pre>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ShowStyle