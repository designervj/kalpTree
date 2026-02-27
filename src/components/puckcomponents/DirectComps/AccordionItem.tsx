import { registerOverlayPortal } from "@puckeditor/core";
import { useEffect, useRef, useState } from "react";
import { generateTextCSS } from "../CustomText";
import { generateSpacingCSS } from "../CustomSpacing";
import { generateBorderCSS } from "../CustomBorder";
import { generateBoxShadowCSS } from "../CustomBoxShadow";
import { generateCSS } from "../CustomSIzing";
import { getBackgroundCSS } from "../CustomBackground";

function AccordionIcon({
  style,
  open,
  closedColor,
  openColor,
}: {
  style: string;
  open: boolean;
  closedColor: string;
  openColor: string;
}) {
  const color = open ? openColor : closedColor;

  if (style === "plus") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 transition-transform duration-200"
      >
        <path
          d="M2 7h10"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {!open && (
          <path
            d="M7 2v10"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      {style === "arrow" ? (
        <path
          d="M2 4l5 6 5-6"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 5l4 4 4-4"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function AccordionItem({
  // Text content
  title = "Accordion Title",
  body = "Accordion body content goes here.",

  // Text styling from Puck fields
  titletext,
  closedtitletext,
  bodytext,

  // Style fields from Puck
  sizing,
  spacing,
  border,
  boxShadow,

  // Icon config — can be passed down from parent Accordion
  defaultOpen = false,
  iconStyle = "chevron",
  iconPosition = "right",
  closedIconColor = "#222C39",
  openIconColor = "#3b82f6",
  background,
}: {
  title?: string;
  body?: string;
  titletext?: any;
  closedtitletext?: any;
  bodytext?: any;
  sizing?: any;
  spacing?: any;
  border?: any;
  boxShadow?: any;
  defaultOpen?: boolean;
  iconStyle?: "plus" | "arrow" | "chevron";
  iconPosition?: "left" | "right";
  closedIconColor?: string;
  openIconColor?: string;
  background?: any;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => registerOverlayPortal(ref.current), [ref.current]);

  // Resolve active tag style from the text field object
  const resolveTextStyle = (textField: any): React.CSSProperties => {
    if (!textField) return {};
    const activeTag = textField.activeTag?.toLowerCase() ?? "h3";
    return generateTextCSS(textField[activeTag]);
  };

  // Title uses different style when open vs closed
  const activeTitleStyle = open
    ? resolveTextStyle(titletext)
    : resolveTextStyle(closedtitletext);

  const activeBodyStyle = resolveTextStyle(bodytext);

  // Container styles applied to the whole item wrapper
  const containerStyle: React.CSSProperties = {
    ...generateCSS(sizing),
    ...generateSpacingCSS(spacing),
    ...generateBorderCSS(border),
    ...generateBoxShadowCSS(boxShadow),
    ...getBackgroundCSS(background),
  };

  const icon = (
    <AccordionIcon
      style={iconStyle}
      open={open}
      closedColor={closedIconColor}
      openColor={openIconColor}
    />
  );

  return (
    <div style={containerStyle} className="w-full">
      <button
        ref={ref}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 py-3 px-1 text-left"
        aria-expanded={open}
      >
        {iconPosition === "left" && icon}
        <span style={activeTitleStyle} className="flex-1">
          {title}
        </span>
        {iconPosition === "right" && icon}
      </button>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: open ? "1000px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div style={activeBodyStyle} className="px-1 pb-3">
          {body}
        </div>
      </div>
    </div>
  );
}

export const toAddInElement = {
  titletext: {
    activeTag: "H1",
    h1: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "30",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h2: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "24",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h3: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "20",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h4: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "18",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h5: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "16",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h6: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    p: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
  },
  closedtitletext: {
    activeTag: "H1",
    h1: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "30",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h2: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "24",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h3: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "20",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h4: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "18",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h5: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "16",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h6: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    p: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
  },
  bodytext: {
    activeTag: "H1",
    h1: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "30",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h2: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "24",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h3: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "20",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h4: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "18",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h5: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "16",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    h6: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
    p: {
      font: "Default",
      fontWeight: "Regular",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
      fontSize: {
        value: "14",
        unit: "px",
      },
      letterSpacing: {
        value: "0",
        unit: "px",
      },
      lineHeight: {
        value: "1",
        unit: "em",
      },
      textShadow: 0,
    },
  },
  sizing: {
    width: {
      value: "",
      unit: "auto",
    },
    maxWidth: {
      value: "",
      unit: "none",
    },
    sectionAlignment: "center",
    minHeight: {
      value: "",
      unit: "auto",
    },
    height: {
      value: "",
      unit: "auto",
    },
    maxHeight: {
      value: "",
      unit: "none",
    },
  },
  spacing: {
    marginTop: {
      value: "0",
      unit: "px",
    },
    marginBottom: {
      value: "0",
      unit: "px",
    },
    marginLeft: {
      value: "",
      unit: "px",
    },
    marginRight: {
      value: "",
      unit: "px",
    },
    paddingTop: {
      value: "",
      unit: "px",
    },
    paddingBottom: {
      value: "",
      unit: "px",
    },
    paddingLeft: {
      value: "",
      unit: "px",
    },
    paddingRight: {
      value: "",
      unit: "px",
    },
  },
  border: {
    radiusTopLeft: {
      value: "10",
      unit: "px",
    },
    radiusTopRight: {
      value: "10",
      unit: "px",
    },
    radiusBottomLeft: {
      value: "0",
      unit: "px",
    },
    radiusBottomRight: {
      value: "0",
      unit: "px",
    },
    activeSide: "all",
    allWidth: {
      value: "0",
      unit: "px",
    },
    allColor: "",
    allStyle: "Solid",
    topWidth: {
      value: "0",
      unit: "px",
    },
    topColor: "",
    topStyle: "Solid",
    rightWidth: {
      value: "0",
      unit: "px",
    },
    rightColor: "",
    rightStyle: "Solid",
    bottomWidth: {
      value: "0",
      unit: "px",
    },
    bottomColor: "",
    bottomStyle: "Solid",
    leftWidth: {
      value: "0",
      unit: "px",
    },
    leftColor: "",
    leftStyle: "Solid",
  },
  boxShadow: {
    presetIndex: 0,
    horizontal: {
      value: "0",
      unit: "px",
    },
    vertical: {
      value: "0",
      unit: "px",
    },
    blur: {
      value: "18",
      unit: "px",
    },
    spread: {
      value: "0",
      unit: "px",
    },
    color: "#000000",
    colorOpacity: "30",
    position: "Inner Shadow",
  },
};
