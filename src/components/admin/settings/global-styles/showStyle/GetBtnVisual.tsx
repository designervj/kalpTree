import { BtnKey, ButtonBaseStyle, ButtonColors } from "../GlobalStyleModal";
import { shadowToCss } from "../util/ColorFunction";


type GetBtnVisualProps = {
    buttonColors: Record<BtnKey, ButtonColors>;
    hoveredBtn: BtnKey | null;
    buttonBase: ButtonBaseStyle;
    k: BtnKey;
}
/* Buttons used in preview areas */
const GetBtnVisual = ({ buttonColors, hoveredBtn, buttonBase, k }: GetBtnVisualProps) => {
    const c = buttonColors[k];
    const hovering = hoveredBtn === k;

    const bg = hovering ? c?.hoverBg : c?.bg;
    const text = hovering ? c?.hoverText : c?.text;
    const border = hovering ? c?.hoverBorder : c?.border;

    return {
        style: {
            fontFamily: buttonBase.fontFamily,
            fontSize: `${buttonBase.sizePx}px`,
            fontWeight: buttonBase.weight as any,
            letterSpacing: `${buttonBase.letterSpacingEm}em`,
            textTransform: buttonBase.transform,
            height: buttonBase.heightPx,
            paddingLeft: buttonBase.paddingXPx,
            paddingRight: buttonBase.paddingXPx,
            borderRadius: buttonBase.radiusPx,
            background: bg,
            color: text,
            borderColor: border,
            borderWidth: buttonBase.borderWidthPx,
            borderStyle: "solid",
            transition: `all ${buttonBase.transitionMs}ms ease`,
            boxShadow: shadowToCss(buttonBase.shadow),
        } as React.CSSProperties,
        className:
            `inline-flex items-center justify-center select-none outline-none ` +
            `focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background`,
    };
};


export default GetBtnVisual;