import { mixHex, rgba } from "../util/ColorFunction";


const Pill = ({ text, mode, brand, uiPalette }: { text: string, mode: string, brand: any, uiPalette: any }) => {

    return (
        <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold border"
            style={{
                background: mode === "light" ? mixHex(brand?.accent || "", "#FFFFFF", 0.65) : rgba(brand?.accent || "", 0.12),
                color: mode === "light" ? (brand?.dark || "#0B3A2A") : uiPalette.text,
                borderColor: rgba(brand?.secondary || "", mode === "light" ? 0.35 : 0.22),
            }}
        >
            {text}
        </span>
    )
};

export default Pill;