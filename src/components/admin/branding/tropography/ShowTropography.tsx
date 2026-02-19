import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useEditorContext } from '@/components/editor/EditorContext'
import { GlobalStyleModel, transformRawToGlobalStyleModel } from '@/components/editor/style-editor/GlobalStyelModel'
import { BodyStyle, BrandColors, BtnKey, ButtonBaseStyle, ButtonColors, HeadingKey, HeadingStyle, LeftTab, RightPanelTab } from '../../settings/global-styles/GlobalStyleModal'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import ColorControl from '../../settings/global-styles/showStyle/ColorControl'
import HeadingControl from '../../settings/global-styles/showStyle/HeadingControl'
import BodyControl from '../../settings/global-styles/showStyle/BodyControl'
import ButtonControl from '../../settings/global-styles/showStyle/ButtonControl'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Code2, Copy, Eye, Moon, Save, Sun } from 'lucide-react'
import HeadingsPreview from '../../settings/global-styles/showStyle/HeadingsPreview'
import BodyPreview from '../../settings/global-styles/showStyle/BodyPreview'
import ButtonsPreview from '../../settings/global-styles/showStyle/ButtonsPreview'
import BrandGalleryPreview from '../../settings/global-styles/showStyle/BrandGalleryPreview'
import { clampHexOrFallback, cssFont, mixHex, rgba, shadowToCss } from '../../settings/global-styles/util/ColorFunction'
import { toast } from 'sonner'
import { Website } from '../../AppShell'
import { updateWebsite } from '@/hooks/slices/websites/WebsiteThunk'


const ShowTropography = () => {

    const { currentWebsite } = useSelector((state: RootState) => state.websites)

    const [currentStyle, setCurrentStyle] = React.useState<GlobalStyleModel | null>(null);
    const [leftTab, setLeftTab] = useState<LeftTab>("colors");
    const [copied, setCopied] = useState(false);
    /* RIGHT tabs */
    const [rightPanel, setRightPanel] = useState<RightPanelTab>("preview");

    const [mode, setMode] = useState<"light" | "dark">("light");

    const [brand, setBrand] = useState<BrandColors>();
    const [headings, setHeadings] = useState<Record<HeadingKey, HeadingStyle>>()
    const [body, setBody] = useState<BodyStyle>();

    const [buttonColors, setButtonColors] = useState<Record<BtnKey, ButtonColors>>();
    const [buttonBase, setButtonBase] = useState<ButtonBaseStyle>();

    const [headingFontFamily, setHeadingFontFamily] = useState<string>("");
    const [selectedHeading, setSelectedHeading] = useState<HeadingKey>("h1");
    const [globalFontFamily, setGlobalFontFamily] = useState<string>("");
    const [selectedBtn, setSelectedBtn] = useState<BtnKey>("primary");
    const [hoveredBtn, setHoveredBtn] = useState<BtnKey | null>(null);
    const [headingBaseSize, setHeadingBaseSize] = useState(17);

    const dispatch = useDispatch<AppDispatch>();
    const headingPx = (k: HeadingKey) => {
        if (!headings) return 0;
        return 102;
        // return Math.round(headingBaseSize * (headings[k]?.scale || 1));
    };

    const ROOT_CSS = useMemo(() => {
        const h = headings;
        if (!h) return "";

        const hPx: Record<HeadingKey, number> = {
            h1: Math.round(headingBaseSize * (h.h1?.scale || 1)),
            h2: Math.round(headingBaseSize * (h.h2?.scale || 1)),
            h3: Math.round(headingBaseSize * (h.h3?.scale || 1)),
            h4: Math.round(headingBaseSize * (h.h4?.scale || 1)),
            h5: Math.round(headingBaseSize * (h.h5?.scale || 1)),
            h6: Math.round(headingBaseSize * (h.h6?.scale || 1)),
        };

        const primary = clampHexOrFallback(brand?.primary ?? "", "#1F6F43");
        const secondary = clampHexOrFallback(brand?.secondary ?? "", "#2EA76A");
        const accent = clampHexOrFallback(brand?.accent ?? "", "#B9F3D5");
        const dark = clampHexOrFallback(brand?.dark ?? "", "#0B3A2A");

        const ring = clampHexOrFallback(brand?.ring ?? "", secondary);

        // mode-specific derived values (stable defaults)
        const lightBg = "#F4F6F5";
        const lightSurface = "#FFFFFF";
        const lightText = clampHexOrFallback(brand?.text ?? "", "#0B2A1F");
        const lightMuted = clampHexOrFallback(brand?.mutedText ?? "", "#5E6E65");
        const lightBorder = clampHexOrFallback(brand?.border ?? "", "#DDE6E1");

        const darkBg = "#071B14";
        const darkSurface = "#0B2A1F";
        const darkText = "#EAF7F0";
        const darkMuted = mixHex("#EAF7F0", "#000000", 0.35);
        const darkBorder = rgba(accent, 0.22);

        const lines: string[] = [];

        lines.push(`/* =========================================================`);
        lines.push(`   BRAND GUIDELINES • GLOBAL TOKENS (COPY TO globals.css)`);
        lines.push(
            `   Usage: documentElement.setAttribute("data-theme","light|dark")`,
        );
        lines.push(
            `   ========================================================= */`,
        );
        lines.push(``);

        // 1) BASE TOKENS (shared across modes)
        lines.push(`:root {`);
        lines.push(`  /* Brand Core */`);
        lines.push(`  --primary: ${primary};`);
        lines.push(`  --secondary: ${secondary};`);
        lines.push(`  --accent: ${accent};`);
        lines.push(`  --dark: ${dark};`);
        lines.push(`  --ring: ${ring};`);
        lines.push(``);
        lines.push(`  /* Fonts */`);
        lines.push(`  --font-body: ${cssFont(globalFontFamily)};`);
        lines.push(`  --font-heading: ${cssFont(headingFontFamily)};`);
        lines.push(`  --font-button: ${cssFont(buttonBase?.fontFamily ?? "")};`);
        lines.push(``);
        lines.push(`  /* Headings (PX only) */`);
        (["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).forEach((k) => {
            const s = h[k];
            if (!s) return;
            lines.push(`  --${k}-size: ${hPx[k]}px;`);
            lines.push(`  --${k}-weight: ${s.weight};`);
            lines.push(`  --${k}-lh: ${s.lineHeight};`);
            lines.push(`  --${k}-ls: ${s.letterSpacingEm}em;`);
        });
        lines.push(``);
        lines.push(`  /* Body */`);
        lines.push(`  --body-size: ${body?.sizePx}px;`);
        lines.push(`  --body-weight: ${body?.weight};`);
        lines.push(`  --body-lh: ${body?.lineHeight};`);
        lines.push(`  --body-ls: ${body?.letterSpacingEm}em;`);
        lines.push(`  --body-maxw: ${body?.maxWidthCh}ch;`);
        lines.push(`  --body-paragraph-gap: ${body?.paragraphGapPx}px;`);
        lines.push(``);
        lines.push(`  /* Buttons (base) */`);
        lines.push(`  --btn-size: ${buttonBase?.sizePx}px;`);
        lines.push(`  --btn-weight: ${buttonBase?.weight};`);
        lines.push(`  --btn-ls: ${buttonBase?.letterSpacingEm}em;`);
        lines.push(`  --btn-transform: ${buttonBase?.transform};`);
        lines.push(`  --btn-radius: ${buttonBase?.radiusPx}px;`);
        lines.push(`  --btn-height: ${buttonBase?.heightPx}px;`);
        lines.push(`  --btn-pad-x: ${buttonBase?.paddingXPx}px;`);
        lines.push(`  --btn-border-w: ${buttonBase?.borderWidthPx}px;`);
        lines.push(`  --btn-shadow: ${shadowToCss(buttonBase?.shadow)};`);
        lines.push(`  --btn-transition: ${buttonBase?.transitionMs}ms;`);
        lines.push(``);
        (["primary", "secondary", "outline"] as BtnKey[]).forEach((k) => {
            const c = buttonColors?.[k];
            lines.push(`  /* Button: ${k.toUpperCase()} */`);
            lines.push(`  --btn-${k}-bg: ${c?.bg};`);
            lines.push(`  --btn-${k}-text: ${c?.text};`);
            lines.push(`  --btn-${k}-border: ${c?.border};`);
            lines.push(`  --btn-${k}-hover-bg: ${c?.hoverBg};`);
            lines.push(`  --btn-${k}-hover-text: ${c?.hoverText};`);
            lines.push(`  --btn-${k}-hover-border: ${c?.hoverBorder};`);
        });
        lines.push(`}`);
        lines.push(``);

        // 2) LIGHT MODE TOKENS
        lines.push(`:root[data-theme="light"] {`);
        lines.push(`  --mode: light;`);
        lines.push(`  --bg: ${lightBg};`);
        lines.push(`  --surface: ${lightSurface};`);
        lines.push(`  --text: ${lightText};`);
        lines.push(`  --muted-text: ${lightMuted};`);
        lines.push(`  --border: ${lightBorder};`);
        lines.push(`}`);
        lines.push(``);

        // 3) DARK MODE TOKENS
        lines.push(`:root[data-theme="dark"] {`);
        lines.push(`  --mode: dark;`);
        lines.push(`  --bg: ${darkBg};`);
        lines.push(`  --surface: ${darkSurface};`);
        lines.push(`  --text: ${darkText};`);
        lines.push(`  --muted-text: ${darkMuted};`);
        lines.push(`  --border: ${darkBorder};`);
        lines.push(`}`);
        lines.push(``);

        // Optional helpers (usable across new pages)
        lines.push(`/* Optional: Base application styles (recommended) */`);
        lines.push(`html, body {`);
        lines.push(`  background: var(--bg);`);
        lines.push(`  color: var(--text);`);
        lines.push(`  font-family: var(--font-body);`);
        lines.push(`}`);
        lines.push(
            `h1{font-family:var(--font-heading);font-size:var(--h1-size);font-weight:var(--h1-weight);line-height:var(--h1-lh);letter-spacing:var(--h1-ls);}`,
        );
        lines.push(
            `h2{font-family:var(--font-heading);font-size:var(--h2-size);font-weight:var(--h2-weight);line-height:var(--h2-lh);letter-spacing:var(--h2-ls);}`,
        );
        lines.push(
            `h3{font-family:var(--font-heading);font-size:var(--h3-size);font-weight:var(--h3-weight);line-height:var(--h3-lh);letter-spacing:var(--h3-ls);}`,
        );
        lines.push(
            `h4{font-family:var(--font-heading);font-size:var(--h4-size);font-weight:var(--h4-weight);line-height:var(--h4-lh);letter-spacing:var(--h4-ls);}`,
        );
        lines.push(
            `h5{font-family:var(--font-heading);font-size:var(--h5-size);font-weight:var(--h5-weight);line-height:var(--h5-lh);letter-spacing:var(--h5-ls);}`,
        );
        lines.push(
            `h6{font-family:var(--font-heading);font-size:var(--h6-size);font-weight:var(--h6-weight);line-height:var(--h6-lh);letter-spacing:var(--h6-ls);}`,
        );
        lines.push(``);

        return lines.join("\n");
    }, [
        brand,
        globalFontFamily,
        headingFontFamily,
        headingBaseSize,
        headings,
        body,
        buttonBase,
        buttonColors,
    ]);
    const softBg = useMemo(() => {
        if (mode === "light") return rgba(brand?.accent || "#B9F3D5", 0.08);
        return rgba(brand?.accent || "#B9F3D5", 0.04);
    }, [mode, brand?.accent]);

    useEffect(() => {
        if (currentWebsite && currentWebsite?.globalStyle) {
            const updatedStyle = transformRawToGlobalStyleModel(currentWebsite?.globalStyle);

            console.log("upddate style", updatedStyle)
            if (updatedStyle) {
                setBrand(updatedStyle.brand);
                setHeadings(updatedStyle.headings);
                setBody(updatedStyle.body);
                setButtonColors(updatedStyle.buttonColors);
                setButtonBase(updatedStyle.buttonBase);
                setHeadingFontFamily(updatedStyle.fonts.heading);
                setGlobalFontFamily(updatedStyle.fonts.body);
            }
            setCurrentStyle(updatedStyle);
        }
    }, [currentWebsite]);


    console.log("currentStyle--->", currentStyle)
    const uiPalette = useMemo(() => {
        const light = {
            bg: currentStyle?.themes?.light?.bg || '#F4F6F5',
            surface: currentStyle?.themes?.light?.surface || '#FFFFFF',
            text: currentStyle?.themes?.light?.text || '#0B2A1F',
            mutedText: currentStyle?.themes?.light?.mutedText || '#5E6E65',
            border: currentStyle?.themes?.light?.border || '#DDE6E1',
        };
        const dark = {
            bg: currentStyle?.themes?.dark?.bg || '#071B14',
            surface: currentStyle?.themes?.dark?.surface || '#0B2A1F',
            text: currentStyle?.themes?.dark?.text || '#EAF7F0',
            mutedText: currentStyle?.themes?.dark?.mutedText || mixHex("#EAF7F0", "#000000", 0.35),
            border: currentStyle?.themes?.dark?.border || rgba(brand?.accent ?? "#B9F3D5", 0.22),
        };
        return mode === "light" ? light : dark;
    }, [mode, currentStyle, brand?.accent]);

    const outerPreviewStyle = useMemo(() => ({
        backgroundColor: uiPalette.bg,
        color: uiPalette.text,
        transition: 'all 0.2s ease',
    }), [uiPalette]);


    const onLeftTab = (tab: LeftTab) => {
        setLeftTab(tab);
        // setRightPanel("preview");
    };

    if (!currentStyle) return null;


    const handleSectionColorChange = (v: Partial<BrandColors>) => {
        setBrand((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                ...v,
            };
        });

        //    Object.entries(v).forEach(([key, value]) => {
        //      if (value) {
        //        const prop = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        //        console.log("prop--->", prop)
        //        console.log("value--->", value)
        //        onStyleChange(prop, value);
        //      }
        //    });
    };

    const handleHeadingChange = (patch: Partial<HeadingStyle>) => {
        setHeadings((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [selectedHeading]: { ...prev[selectedHeading], ...patch },
            };
        });

        //    console.log("patch--->", patch)
        //    console.log("selectedHeading--->", selectedHeading)
        //    if (patch.scale !== undefined) onStyleChange(`--${selectedHeading}-size`, `${patch.scale}px`);
        //    if (patch.weight !== undefined) onStyleChange(`--${selectedHeading}-weight`, patch.weight.toString());
        //    if (patch.lineHeight !== undefined) onStyleChange(`--${selectedHeading}-lh`, patch.lineHeight.toString());
        //    if (patch.letterSpacingEm !== undefined) onStyleChange(`--${selectedHeading}-ls`, `${patch.letterSpacingEm}em`);
    };

    const handleBodyChange = (patch: Partial<BodyStyle>) => {
        setBody((prev) => {
            if (!prev) return prev;
            return { ...prev, ...patch } as BodyStyle;
        });

        //    if (patch.sizePx !== undefined) onStyleChange("--body-size", `${patch.sizePx}px`);
        //    if (patch.weight !== undefined) onStyleChange("--body-weight", patch.weight.toString());
        //    if (patch.lineHeight !== undefined) onStyleChange("--body-lh", patch.lineHeight.toString());
        //    if (patch.letterSpacingEm !== undefined) onStyleChange("--body-ls", `${patch.letterSpacingEm}em`);
        //    if (patch.maxWidthCh !== undefined) onStyleChange("--body-maxw", `${patch.maxWidthCh}ch`);
        //    if (patch.paragraphGapPx !== undefined) onStyleChange("--body-paragraph-gap", `${patch.paragraphGapPx}px`);
    };

    const handleButtonBaseChange = (patch: Partial<ButtonBaseStyle>) => {
        setButtonBase((prev) => {
            if (!prev) return prev;
            return { ...prev, ...patch };
        });

        //    if (patch.sizePx !== undefined) onStyleChange("--btn-size", `${patch.sizePx}px`);
        //    if (patch.weight !== undefined) onStyleChange("--btn-weight", patch.weight.toString());
        //    if (patch.radiusPx !== undefined) onStyleChange("--btn-radius", `${patch.radiusPx}px`);
        //    if (patch.heightPx !== undefined) onStyleChange("--btn-height", `${patch.heightPx}px`);
        //    if (patch.paddingXPx !== undefined) onStyleChange("--btn-padding-x", `${patch.paddingXPx}px`);
        //    if (patch.borderWidthPx !== undefined) onStyleChange("--btn-border-width", `${patch.borderWidthPx}px`);
        //    if (patch.transitionMs !== undefined) onStyleChange("--btn-transition", `${patch.transitionMs}ms`);
        //    if (patch.fontFamily !== undefined) onStyleChange("--font-button", patch.fontFamily);
        //    if (patch.transform !== undefined) onStyleChange("--btn-transform", patch.transform);
        //    if (patch.shadow !== undefined) onStyleChange("--btn-shadow", patch.shadow);
    };

    const handleButtonColorChange = (patch: any) => {
        // Check if patch is from setButtonColors((prev) => ...) pattern
        if (typeof patch === 'function') {
            setButtonColors((prev) => {
                const next = patch(prev);
                // This is a generic setter, usually we prefer direct patches for canvas sync
                // But we'll apply the next state to local state
                return next;
            });
            return;
        }

        setButtonColors((prev) => {
            if (!prev) return prev;
            const next = { ...prev, [selectedBtn]: { ...prev[selectedBtn], ...patch } };

            // Push each color to canvas
            //  Object.entries(patch).forEach(([key, value]) => {
            //    if (value) {
            //      const prop = `--btn-${selectedBtn}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            //      onStyleChange(prop, value as string);
            //    }
            //  });

            return next;
        });
    };

    const handleCopyRoot = async () => {
        try {
            await navigator.clipboard.writeText(ROOT_CSS);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            toast.error("Failed to copy CSS");
            // ignore
        }
    };



    const ColorsPreview = BrandGalleryPreview;

    const RightPreviewContent =
        leftTab === "colors"
            ? ColorsPreview
            : leftTab === "headings"
                ? HeadingsPreview
                : leftTab === "body"
                    ? BodyPreview
                    : ButtonsPreview;

    const previewProps = {
        uiPalette,
        mode,
        brand: brand || {},
        headingFontFamily,
        headings: headings || {} as any,
        headingPx,
        leftTab,
        onLeftTab,
        cardPreviewStyle: outerPreviewStyle,
        headingBaseSize,
        body: body || {} as any,
        globalFontFamily,
        buttonBase: buttonBase || {} as any,
        buttonColors: buttonColors || {} as any,
        softBg,
        hoveredBtn,
        setHoveredBtn,
    };


    const handleSave = async () => {
        if (!currentWebsite?._id) {
            toast.error("Please select a website");
            return;
        }
        try {
            console.log("Rccs", ROOT_CSS);
            const data = `<style>${ROOT_CSS}</style>`;
            const allCurrentWebsite: Website = {
                ...currentWebsite,
                globalStyle: data
            }

            const response = await dispatch(updateWebsite({
                id: currentWebsite._id.toString(),
                websiteData: allCurrentWebsite
            })).unwrap()


            toast.success("Styles saved successfully");


        } catch {
            toast.error("Failed to save styles");
            // ignore
        }
    }

 
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
                        {mode === "light" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
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
                            setButtonColors={setButtonColors as any}
                        />

                    }
                    {leftTab === "headings" && headings && <HeadingControl
                        headings={headings}
                        headingFontFamily={headingFontFamily ?? ""}
                        setHeadingFontFamily={(value) => {
                            setHeadingFontFamily(value);
                            // onStyleChange("--font-heading", value);
                        }}
                        setH={(value) => handleHeadingChange(value)}
                        selectedHeading={selectedHeading}
                        setSelectedHeading={setSelectedHeading}
                    />}
                    {leftTab === "body" && body && <BodyControl
                        body={body}
                        setBody={(patch) => handleBodyChange(patch)}
                        globalFontFamily={globalFontFamily}
                        setGlobalFontFamily={(value) => {
                            setGlobalFontFamily(value);
                            // onStyleChange("--font-body", value);
                        }}
                    />}
                    {leftTab === "buttons" && buttonBase && buttonColors && <ButtonControl
                        buttonBase={buttonBase}
                        setButtonBase={(patch) => handleButtonBaseChange(patch)}
                        buttonColors={buttonColors}
                        setButtonColors={handleButtonColorChange as any}
                        selectedBtn={selectedBtn}
                        setSelectedBtn={setSelectedBtn}
                    />}
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-8">
                    <Card className="h-full min-h-[580px] border-2 border-muted/40">
                        <div className="border-b p-2 flex items-center justify-end gap-2 rounded-t-lg">
                            {rightPanel === "root" && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCopyRoot}
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSave}
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        {copied ? "Saved" : "Save"}
                                    </Button>
                                </>
                            )}
                        </div>

                        {rightPanel === "preview" ? (
                            <CardContent className="p-6 md:p-8" style={outerPreviewStyle}>
                                <RightPreviewContent {...previewProps} />
                            </CardContent>
                        ) : (
                            <CardContent className="p-6">
                                <div className="mb-3">
                                    <p className="text-sm font-semibold">Root File Code (LIVE)</p>
                                    <p className="text-xs text-muted-foreground">
                                        Light/Dark have separate variables via{" "}
                                        <span className="font-mono">:root[data-theme="..."]</span>.
                                        Gradient removed (solid hero).
                                    </p>
                                </div>
                                <pre className="text-xs leading-relaxed p-4 rounded-lg border bg-muted/20 overflow-auto max-h-[520px]">
                                    <code>{ROOT_CSS}</code>
                                </pre>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ShowTropography