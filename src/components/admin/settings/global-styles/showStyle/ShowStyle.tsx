import { Button } from '@/components/ui/button';
import React, { useEffect, useMemo, useState } from 'react'
import { BrandColors, HeadingKey, HeadingStyle, LeftTab } from '../GlobalStyleModal';
import { Code2, Eye, Moon, Sun } from 'lucide-react';
import ColorControl from './ColorControl';
import { Card, CardContent } from '@/components/ui/card';
import { mixHex, rgba } from '../util/ColorFunction';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ShowStyle = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [leftTab, setLeftTab] = useState<LeftTab>("colors");
  const [rightPanel, setRightPanel] = useState<"preview" | "root">("preview");

  const { currentStyle } = useSelector((state: RootState) => state.globalStyle)

  const [brand, setBrand] = useState<BrandColors>();
  const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>()
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
          lineHeight: parseFloat(getVal("h1-line-height")),
          letterSpacingEm: parseFloat(getVal("h1-letter-spacing")),
        },
        h2: {
          scale: parseFloat(getVal("h2-scale")),
          weight: parseInt(getVal("h2-weight")),
          lineHeight: parseFloat(getVal("h2-line-height")),
          letterSpacingEm: parseFloat(getVal("h2-letter-spacing")),
        },
        h3: {
          scale: parseFloat(getVal("h3-scale")),
          weight: parseInt(getVal("h3-weight")),
          lineHeight: parseFloat(getVal("h3-line-height")),
          letterSpacingEm: parseFloat(getVal("h3-letter-spacing")),
        },
        h4: {
          scale: parseFloat(getVal("h4-scale")),
          weight: parseInt(getVal("h4-weight")),
          lineHeight: parseFloat(getVal("h4-line-height")),
          letterSpacingEm: parseFloat(getVal("h4-letter-spacing")),
        },
        h5: {
          scale: parseFloat(getVal("h5-scale")),
          weight: parseInt(getVal("h5-weight")),
          lineHeight: parseFloat(getVal("h5-line-height")),
          letterSpacingEm: parseFloat(getVal("h5-letter-spacing")),
        },
        h6: {
          scale: parseFloat(getVal("h6-scale")),
          weight: parseInt(getVal("h6-weight")),
          lineHeight: parseFloat(getVal("h6-line-height")),
          letterSpacingEm: parseFloat(getVal("h6-letter-spacing")),
        },
      }));
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
    // setBrand((prev) => ({
    //   ...prev,
    //   ...v,
    // }));
  };
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
            />

          }
          {/* {leftTab === "headings" && headingControls} */}
          {/* {leftTab === "body" && bodyControls} */}
          {/* {leftTab === "buttons" && buttonControls} */}
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