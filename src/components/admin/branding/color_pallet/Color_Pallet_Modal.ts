import { BrandColors, ButtonColors } from "../../settings/global-styles/GlobalStyleModal";

export interface colorModal {
    brand: BrandColors,
    buttons: {
        primary?: ButtonColors,
        secondary?: ButtonColors,
        outline?: ButtonColors,
        ghost?: ButtonColors,
        link?: ButtonColors
    }
}
export interface ColorPalletModal {
    _id: string;
    name: string;
    url?: string;
    fontType?: string;
    seed?: string;
    colors: colorModal
};

