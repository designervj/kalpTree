import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import React from "react";
import { BrandColors, BtnKey, ButtonColors } from "../GlobalStyleModal";
import { Separator } from "@/components/ui/separator";
import HexInput from "./HexInput";
import ColorPallet from "@/app/admin/websites/[website]/branding/typography/ColorPallet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateCurrentWebsiteGlobalStyle } from "@/hooks/slices/websites/WebsiteSlice";
import { colorModal } from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";
import { updateCssWithColors } from "@/components/editor/style-editor/GlobalStyelModel";
import { updateCurrentBusinessWebsiteGlobalStyle } from "@/hooks/slices/business/BusinessSlice";

type ColorControlProps = {
  brand: BrandColors;
  setBrand: (v: BrandColors) => void;
  uiPalette: { bg: string; surface: string };
  setC: (v: Partial<BrandColors>) => void;
  setButtonColors: (v: Record<BtnKey, ButtonColors>) => void;
};

const ColorControl = ({
  brand,
  setBrand,
  uiPalette,
  setC,
  setButtonColors,
}: ColorControlProps) => {
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch();

  const handleColorPallet = (allcolors: any) => {
    if (!allcolors) return;

    const { brand: paletteBrand, buttons: paletteButtons } = allcolors;

    if (!currentBusiness || !currentBusiness?.website?.globalStyle) {
      return;
    }

    const brandColors = {
      brand: paletteBrand,
      buttons: paletteButtons,
    };

    const updateRoot = updateCssWithColors(
      currentBusiness?.website?.globalStyle,
      brandColors,
    );
    console.log("brandColors", brandColors);
    console.log("updateRoot", updateRoot);

    // Update individual local states in parent (GlobalStyle.tsx)
    if (paletteBrand) setBrand(paletteBrand);
    if (paletteButtons) setButtonColors(paletteButtons);

    // Update the global style string in Redux
    dispatch(updateCurrentBusinessWebsiteGlobalStyle(updateRoot));
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Theme Colors</p>
              <p className="text-xs text-muted-foreground">
                Left side change → right preview same time update.
                (Background/Surface are mode-driven)
              </p>
            </div>
          </div>
        </div>
        <ColorPallet handleColorPallet={handleColorPallet} />
        <HexInput
          label="Primary"
          value={!brand?.primary ? "#1F6F43" : brand?.primary}
          fallback="#1F6F43"
          onCommit={(v) => setC({ primary: v })}
        />
        <HexInput
          label="Secondary"
          value={!brand?.secondary ? "#2EA76A" : brand?.secondary}
          fallback="#2EA76A"
          onCommit={(v) => setC({ secondary: v })}
        />
        <HexInput
          label="Accent"
          value={!brand?.accent ? "#B9F3D5" : brand?.accent}
          fallback="#B9F3D5"
          onCommit={(v) => setC({ accent: v })}
        />
        <HexInput
          label="Dark"
          value={!brand?.dark ? "#0B3A2A" : brand?.dark}
          fallback="#0B3A2A"
          onCommit={(v) => setC({ dark: v })}
        />

        <Separator />

        <HexInput
          label="Text (Light Mode)"
          value={!brand?.text ? "#0B2A1F" : brand?.text}
          fallback="#0B2A1F"
          onCommit={(v) => setC({ text: v })}
        />
        <HexInput
          label="Muted Text (Light Mode)"
          value={!brand?.mutedText ? "#5E6E65" : brand?.mutedText}
          fallback="#5E6E65"
          onCommit={(v) => setC({ mutedText: v })}
        />
        <HexInput
          label="Border (Light Mode)"
          value={!brand?.border ? "#DDE6E1" : brand?.border}
          fallback="#DDE6E1"
          onCommit={(v) => setC({ border: v })}
        />
        <HexInput
          label="Ring"
          value={!brand?.ring ? "#2EA76A" : brand?.ring}
          fallback="#2EA76A"
          onCommit={(v) => setC({ ring: v })}
        />

        <div className="rounded-lg border p-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Mode Background</span>
            <span className="font-mono">{uiPalette.bg}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span>Mode Surface</span>
            <span className="font-mono">{uiPalette.surface}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorControl;
