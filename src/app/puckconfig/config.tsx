import * as React from "react";

const px = (v: any, fallback = 0) => {
  if (v === undefined || v === null || v === "") return `${fallback}px`;
  if (typeof v === "number") return `${v}px`;
  return String(v);
};

const safeNum = (v: any, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const getSpacingStyle = (props: any): React.CSSProperties => ({
  marginTop: px(props.marginTop, 0),
  marginRight: px(props.marginRight, 0),
  marginBottom: px(props.marginBottom, 0),
  marginLeft: px(props.marginLeft, 0),
  paddingTop: px(props.paddingTop, 0),
  paddingRight: px(props.paddingRight, 0),
  paddingBottom: px(props.paddingBottom, 0),
  paddingLeft: px(props.paddingLeft, 0),
});

const getTypographyStyle = (props: any): React.CSSProperties => ({
  fontSize: px(props.fontSize, 16),
  fontWeight: props.fontWeight || 400,
  lineHeight: props.lineHeight || 1.5,
  letterSpacing: props.letterSpacing ?? 0,
  fontFamily: props.fontFamily || "inherit",
  textAlign: props.textAlign || "left",
  color: props.color || "#111111",
});

const getBoxStyle = (props: any): React.CSSProperties => ({
  backgroundColor: props.backgroundColor || "transparent",
  borderWidth: px(props.borderWidth, 0),
  borderStyle: props.borderStyle || "none",
  borderColor: props.borderColor || "#e5e7eb",
  borderRadius: px(props.borderRadius, 0),
  boxShadow: props.boxShadow || "none",
  opacity: props.opacity !== undefined ? safeNum(props.opacity, 1) : 1,
});

const getSizeStyle = (props: any): React.CSSProperties => ({
  width: props.widthMode === "full" ? "100%" : props.width || "auto",
  maxWidth: props.maxWidth || (props.widthMode === "full" ? "100%" : "100%"),
  minWidth: px(props.minWidth, 0),
  height: props.heightAuto ? "auto" : px(props.height, 0),
  minHeight: px(props.minHeight, 0),
  maxHeight: props.maxHeight || "none",
});

const getFlexStyle = (props: any): React.CSSProperties => {
  const isFlex = props.display === "flex";
  return {
    display: props.display || "block",
    flexDirection: isFlex ? props.flexDirection || "row" : undefined,
    justifyContent: isFlex ? props.justifyContent || "flex-start" : undefined,
    alignItems: isFlex ? props.alignItems || "stretch" : undefined,
    flexWrap: isFlex ? props.flexWrap || "nowrap" : undefined,
    gap: isFlex ? px(props.gap, 0) : undefined,
  };
};

const combine = (...styles: React.CSSProperties[]): React.CSSProperties =>
  Object.assign({}, ...styles);

const EmptyDropHint = ({ label = "Drop blocks here" }: { label?: string }) => (
  <div
    style={{
      border: "1px dashed #cbd5e1",
      borderRadius: 8,
      padding: "12px",
      minHeight: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#64748b",
      fontSize: 13,
      background: "rgba(148,163,184,0.06)",
      textAlign: "center",
    }}
  >
    {label}
  </div>
);

// ---------- Shared field groups ----------

const spacingFields = {
  marginTop: { type: "number", label: "Margin Top", defaultValue: 0 },
  marginRight: { type: "number", label: "Margin Right", defaultValue: 0 },
  marginBottom: { type: "number", label: "Margin Bottom", defaultValue: 0 },
  marginLeft: { type: "number", label: "Margin Left", defaultValue: 0 },

  paddingTop: { type: "number", label: "Padding Top", defaultValue: 0 },
  paddingRight: { type: "number", label: "Padding Right", defaultValue: 0 },
  paddingBottom: { type: "number", label: "Padding Bottom", defaultValue: 0 },
  paddingLeft: { type: "number", label: "Padding Left", defaultValue: 0 },
};

const typographyFields = {
  fontSize: { type: "number", label: "Font Size", defaultValue: 16 },
  fontWeight: {
    type: "select",
    label: "Font Weight",
    options: [
      { label: "100", value: 100 },
      { label: "200", value: 200 },
      { label: "300", value: 300 },
      { label: "400", value: 400 },
      { label: "500", value: 500 },
      { label: "600", value: 600 },
      { label: "700", value: 700 },
      { label: "800", value: 800 },
      { label: "900", value: 900 },
    ],
    defaultValue: 400,
  },
  lineHeight: { type: "text", label: "Line Height", defaultValue: "1.5" }, // can be unitless
  letterSpacing: { type: "number", label: "Letter Spacing", defaultValue: 0 },
  fontFamily: { type: "text", label: "Font Family", defaultValue: "inherit" },
  textAlign: {
    type: "radio",
    label: "Text Align",
    options: [
      { label: "L", value: "left" },
      { label: "C", value: "center" },
      { label: "R", value: "right" },
      { label: "J", value: "justify" },
    ],
    defaultValue: "left",
  },
  color: { type: "text", label: "Text Color", defaultValue: "#111111" },
};

const boxStyleFields = {
  backgroundColor: {
    type: "text",
    label: "Background",
    defaultValue: "transparent",
  },
  borderWidth: { type: "number", label: "Border Width", defaultValue: 0 },
  borderStyle: {
    type: "select",
    label: "Border Style",
    options: [
      { label: "None", value: "none" },
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
      { label: "Double", value: "double" },
    ],
    defaultValue: "none",
  },
  borderColor: { type: "text", label: "Border Color", defaultValue: "#e5e7eb" },
  borderRadius: { type: "number", label: "Radius", defaultValue: 0 },
  boxShadow: { type: "text", label: "Shadow", defaultValue: "none" },
  opacity: { type: "text", label: "Opacity", defaultValue: "1" },
};

const sizeFields = {
  widthMode: {
    type: "select",
    label: "Width Mode",
    options: [
      { label: "Auto", value: "auto" },
      { label: "Full", value: "full" },
      { label: "Custom", value: "custom" },
    ],
    defaultValue: "auto",
  },
  width: { type: "text", label: "Custom Width", defaultValue: "auto" },
  maxWidth: { type: "text", label: "Max Width", defaultValue: "100%" },
  minWidth: { type: "number", label: "Min Width", defaultValue: 0 },

  heightAuto: {
    type: "radio",
    label: "Height",
    options: [
      { label: "Auto", value: true },
      { label: "Fixed", value: false },
    ],
    defaultValue: true,
  },
  height: { type: "number", label: "Height px", defaultValue: 0 },
  minHeight: { type: "number", label: "Min Height", defaultValue: 0 },
  maxHeight: { type: "text", label: "Max Height", defaultValue: "none" },
};

const layoutFields = {
  display: {
    type: "select",
    label: "Display",
    options: [
      { label: "Block", value: "block" },
      { label: "Inline Block", value: "inline-block" },
      { label: "Flex", value: "flex" },
    ],
    defaultValue: "block",
  },
  flexDirection: {
    type: "select",
    label: "Flex Direction",
    options: [
      { label: "Row", value: "row" },
      { label: "Column", value: "column" },
    ],
    defaultValue: "row",
  },
  justifyContent: {
    type: "select",
    label: "Justify",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Between", value: "space-between" },
      { label: "Around", value: "space-around" },
      { label: "Evenly", value: "space-evenly" },
    ],
    defaultValue: "flex-start",
  },
  alignItems: {
    type: "select",
    label: "Align",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Stretch", value: "stretch" },
      { label: "Baseline", value: "baseline" },
    ],
    defaultValue: "stretch",
  },
  flexWrap: {
    type: "select",
    label: "Wrap",
    options: [
      { label: "No Wrap", value: "nowrap" },
      { label: "Wrap", value: "wrap" },
    ],
    defaultValue: "nowrap",
  },
  gap: { type: "number", label: "Gap", defaultValue: 0 },
};

const commonFields = {
  className: { type: "text", label: "Class", defaultValue: "" },
  id: { type: "text", label: "ID", defaultValue: "" },
};

const CustomSlot = (props: any) => {
  return <span {...props} />;
};

// ---------- Config ----------

export const config = {
  components: {
    // --------------------------------------------------
    // Heading
    // --------------------------------------------------
    HeadingBlock: {
      fields: {
        text: {
          type: "text",
          label: "Text",
          defaultValue: "This is a heading",
        },
        tag: {
          type: "select",
          label: "Tag",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
          defaultValue: "h2",
        },
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        ...commonFields,
      },
      render: (props: any) => {
        const Tag = props.tag || "h2";
        const style = combine(
          getTypographyStyle(props),
          getSpacingStyle(props),
          getBoxStyle(props),
          getSizeStyle({
            ...props,
            minHeight: props.minHeight || 0,
          }),
        );

        return (
          <Tag
            id={props.id || undefined}
            className={props.className || undefined}
            style={style}
          >
            {props.text || "Heading"}
          </Tag>
        );
      },
    },

    // --------------------------------------------------
    // Paragraph
    // --------------------------------------------------
    ParagraphBlock: {
      fields: {
        text: {
          type: "textarea",
          label: "Text",
          defaultValue: "This is a paragraph block. Add your content here.",
        },
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        ...commonFields,
      },
      render: (props: any) => {
        const style = combine(
          getTypographyStyle(props),
          getSpacingStyle(props),
          getBoxStyle(props),
          getSizeStyle({
            ...props,
            heightAuto: true,
            minHeight: props.minHeight || 0,
          }),
          { whiteSpace: "pre-wrap" },
        );

        return (
          <p
            id={props.id || undefined}
            className={props.className || undefined}
            style={style}
          >
            {props.text || "Paragraph text"}
          </p>
        );
      },
    },

    // --------------------------------------------------
    // Button
    // --------------------------------------------------
    ButtonBlock: {
      fields: {
        label: { type: "text", label: "Label", defaultValue: "Click me" },
        href: { type: "text", label: "URL", defaultValue: "#" },
        target: {
          type: "select",
          label: "Target",
          options: [
            { label: "Same Tab", value: "_self" },
            { label: "New Tab", value: "_blank" },
          ],
          defaultValue: "_self",
        },
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        textDecoration: {
          type: "select",
          label: "Underline",
          options: [
            { label: "No", value: "none" },
            { label: "Yes", value: "underline" },
          ],
          defaultValue: "none",
        },
        ...commonFields,
      },
      render: (props: any) => {
        const style = combine(
          getTypographyStyle(props),
          getSpacingStyle({
            ...props,
            paddingTop: props.paddingTop ?? 10,
            paddingRight: props.paddingRight ?? 16,
            paddingBottom: props.paddingBottom ?? 10,
            paddingLeft: props.paddingLeft ?? 16,
          }),
          getBoxStyle({
            ...props,
            backgroundColor: props.backgroundColor || "#111827",
            color: props.color || "#ffffff",
            borderRadius: props.borderRadius ?? 8,
          }),
          getSizeStyle(props),
          {
            display: "inline-block",
            textDecoration: props.textDecoration || "none",
            cursor: "pointer",
          },
        );

        return (
          <a
            id={props.id || undefined}
            className={props.className || undefined}
            href={props.href || "#"}
            target={props.target || "_self"}
            rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
            style={style}
          >
            {props.label || "Click me"}
          </a>
        );
      },
    },

    // --------------------------------------------------
    // Image
    // --------------------------------------------------
    ImageBlock: {
      fields: {
        src: {
          type: "text",
          label: "Image URL",
          defaultValue: "https://via.placeholder.com/1000x500?text=Image",
        },
        alt: { type: "text", label: "Alt", defaultValue: "Image" },
        objectFit: {
          type: "select",
          label: "Fit",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            { label: "Fill", value: "fill" },
            { label: "None", value: "none" },
          ],
          defaultValue: "cover",
        },
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        ...commonFields,
      },
      render: (props: any) => {
        const style = combine(
          getSpacingStyle(props),
          getBoxStyle(props),
          getSizeStyle({
            ...props,
            widthMode: props.widthMode || "full",
            maxWidth: props.maxWidth || "100%",
            heightAuto: props.heightAuto ?? true,
            minHeight: props.minHeight || 120, // visible in editor
          }),
          {
            display: "block",
            objectFit: props.objectFit || "cover",
          },
        );

        return (
          <img
            id={props.id || undefined}
            className={props.className || undefined}
            src={props.src}
            alt={props.alt}
            style={style}
          />
        );
      },
    },

    // --------------------------------------------------
    // Divider
    // --------------------------------------------------
    DividerBlock: {
      fields: {
        color: { type: "text", label: "Color", defaultValue: "#e5e7eb" },
        thickness: { type: "number", label: "Thickness", defaultValue: 1 },
        width: { type: "text", label: "Width", defaultValue: "100%" },
        styleType: {
          type: "select",
          label: "Line Style",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
          defaultValue: "solid",
        },
        ...spacingFields,
        ...commonFields,
      },
      render: (props: any) => (
        <hr
          id={props.id || undefined}
          className={props.className || undefined}
          style={{
            ...getSpacingStyle(props),
            border: "none",
            borderTop: `${px(props.thickness, 1)} ${props.styleType || "solid"} ${props.color || "#e5e7eb"}`,
            width: props.width || "100%",
          }}
        />
      ),
    },

    // --------------------------------------------------
    // Spacer
    // --------------------------------------------------
    SpacerBlock: {
      fields: {
        height: { type: "number", label: "Height", defaultValue: 32 },
        backgroundColor: {
          type: "text",
          label: "Background",
          defaultValue: "transparent",
        },
        ...spacingFields,
        ...commonFields,
      },
      render: (props: any) => (
        <div
          id={props.id || undefined}
          className={props.className || undefined}
          style={{
            ...getSpacingStyle(props),
            width: "100%",
            height: px(props.height, 32),
            backgroundColor: props.backgroundColor || "transparent",
          }}
        />
      ),
    },

    // --------------------------------------------------
    // List
    // --------------------------------------------------
    ListBlock: {
      fields: {
        items: {
          type: "textarea",
          label: "Items (one per line)",
          defaultValue: "First item\nSecond item\nThird item",
        },
        ordered: {
          type: "radio",
          label: "Type",
          options: [
            { label: "UL", value: "ul" },
            { label: "OL", value: "ol" },
          ],
          defaultValue: "ul",
        },
        listStylePosition: {
          type: "radio",
          label: "Marker",
          options: [
            { label: "Outside", value: "outside" },
            { label: "Inside", value: "inside" },
          ],
          defaultValue: "outside",
        },
        ...typographyFields,
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        ...commonFields,
      },
      render: (props: any) => {
        const Tag = (props.ordered || "ul") as "ul" | "ol";
        const items = String(props.items || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        const style = combine(
          getTypographyStyle(props),
          getSpacingStyle({
            ...props,
            paddingLeft: props.paddingLeft ?? 20,
          }),
          getBoxStyle(props),
          getSizeStyle(props),
          {
            listStylePosition: props.listStylePosition || "outside",
          },
        );

        return (
          <Tag
            id={props.id || undefined}
            className={props.className || undefined}
            style={style}
          >
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </Tag>
        );
      },
    },

    // --------------------------------------------------
    // Droppable Container (WordPress Group-like)
    // --------------------------------------------------
    ContainerBlock: {
      fields: {
        ...layoutFields,
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        ...typographyFields,

        // visual-editor helpers
        showDropHint: {
          type: "radio",
          label: "Show Empty Hint",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
          defaultValue: true,
        },
        dropHintLabel: {
          type: "text",
          label: "Hint Text",
          defaultValue: "Drop blocks here",
        },

        content: {
          type: "slot",
          label: "Content",
        },

        ...commonFields,
      },

      render: (props: any) => {
        const style = combine(
          getFlexStyle(props),
          getSpacingStyle({
            ...props,
            paddingTop: props.paddingTop ?? 16,
            paddingRight: props.paddingRight ?? 16,
            paddingBottom: props.paddingBottom ?? 16,
            paddingLeft: props.paddingLeft ?? 16,
          }),
          getBoxStyle({
            ...props,
            borderStyle: props.borderStyle || "solid",
            borderColor: props.borderColor || "#e5e7eb",
            borderWidth: props.borderWidth ?? 1,
            borderRadius: props.borderRadius ?? 12,
            backgroundColor: props.backgroundColor || "#ffffff",
          }),
          getSizeStyle({
            ...props,
            widthMode: props.widthMode || "full",
            minHeight: props.minHeight || 100, // ✅ prevent 0 height
          }),
          getTypographyStyle(props),
        );

        const hasContent = !!props.content;

        return (
          <div
            id={props.id || undefined}
            className={props.className || undefined}
            style={style}
          >
            {hasContent ? (
              props.content
            ) : props.showDropHint ? (
              <EmptyDropHint label={props.dropHintLabel} />
            ) : null}
          </div>
        );
      },
    },

    // --------------------------------------------------
    // Grid Container (NEW) - droppable grid wrapper
    // --------------------------------------------------
    GridContainerBlock: {
      fields: {
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,

        columns: {
          type: "number",
          label: "Columns",
          defaultValue: 3,
          max: 12,
          min: 1,
        },
        minColumnWidth: {
          type: "number",
          label: "Min Col Width",
          defaultValue: 220,
        },
        gap: {
          type: "number",
          label: "Gap",
          defaultValue: 16,
        },

        // choose grid mode
        gridMode: {
          type: "select",
          label: "Grid Mode",
          options: [
            { label: "Equal Columns", value: "equal" },
            { label: "Auto Fit", value: "autofit" },
          ],
          defaultValue: "equal",
        },

        alignItems: {
          type: "select",
          label: "Align Items",
          options: [
            { label: "Stretch", value: "stretch" },
            { label: "Start", value: "start" },
            { label: "Center", value: "center" },
            { label: "End", value: "end" },
          ],
          defaultValue: "stretch",
        },

        showDropHint: {
          type: "radio",
          label: "Show Empty Hint",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
          defaultValue: true,
        },

        content: {
          type: "slot",
          label: "Grid Content",
        },

        ...commonFields,
      },

      render: (props: any) => {
        const gridTemplateColumns =
          props.gridMode === "autofit"
            ? `repeat(auto-fit, minmax(${px(props.minColumnWidth, 220)}, 1fr))`
            : `repeat(${props.columns}, 1fr)`;

        const style = combine(
          getSpacingStyle({
            ...props,
            paddingTop: props.paddingTop ?? 16,
            paddingRight: props.paddingRight ?? 16,
            paddingBottom: props.paddingBottom ?? 16,
            paddingLeft: props.paddingLeft ?? 16,
          }),
          getBoxStyle({
            ...props,
            borderStyle: props.borderStyle || "solid",
            borderColor: props.borderColor || "#e5e7eb",
            borderWidth: props.borderWidth ?? 1,
            borderRadius: props.borderRadius ?? 12,
            backgroundColor: props.backgroundColor || "#ffffff",
          }),
          getSizeStyle({
            ...props,
            widthMode: props.widthMode || "full",
            minHeight: props.minHeight || 140, // ✅ visible default
          }),
          {
            display: "grid",
            gridTemplateColumns,
            gap: px(props.gap, 16),
            alignItems: props.alignItems || "stretch",
          },
        );

        const hasContent = !!props.content;

        return (
          <section>
            <props.content
              id={props.id || undefined}
              className={props.className || undefined}
              style={style}
              as={CustomSlot}
            />
          </section>
        );
      },
    },

    // --------------------------------------------------
    // Grid Item (optional nested wrapper inside grid)
    // Droppable so each cell can hold anything
    // --------------------------------------------------
    GridItemBlock: {
      fields: {
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,
        columnSpan: { type: "number", label: "Column Span", defaultValue: 1 },
        rowSpan: { type: "number", label: "Row Span", defaultValue: 1 },

        content: {
          type: "slot",
          label: "Item Content",
        },

        ...commonFields,
      },

      render: (props: any) => {
        const style = combine(
          getSpacingStyle({
            ...props,
            paddingTop: props.paddingTop ?? 12,
            paddingRight: props.paddingRight ?? 12,
            paddingBottom: props.paddingBottom ?? 12,
            paddingLeft: props.paddingLeft ?? 12,
          }),
          getBoxStyle({
            ...props,
            borderStyle: props.borderStyle || "solid",
            borderColor: props.borderColor || "#e5e7eb",
            borderWidth: props.borderWidth ?? 1,
            borderRadius: props.borderRadius ?? 10,
            backgroundColor: props.backgroundColor || "#f8fafc",
          }),
          getSizeStyle({
            ...props,
            heightAuto: props.heightAuto ?? true,
            minHeight: props.minHeight || 80,
          }),
          {
            gridColumn: `span ${Math.max(1, safeNum(props.columnSpan, 1))}`,
            gridRow: `span ${Math.max(1, safeNum(props.rowSpan, 1))}`,
          },
        );

        return (
          <div
            id={props.id || undefined}
            className={props.className || undefined}
            style={style}
          >
            <props.content />
          </div>
        );
      },
    },

    // --------------------------------------------------
    // Two Column (droppable left + right)
    // --------------------------------------------------
    TwoColumnBlock: {
      fields: {
        ...spacingFields,
        ...boxStyleFields,
        ...sizeFields,

        gap: { type: "number", label: "Gap", defaultValue: 24 },
        stackOnMobile: {
          type: "radio",
          label: "Stack on Mobile",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
          defaultValue: true,
        },

        leftBg: { type: "text", label: "Left BG", defaultValue: "#f8fafc" },
        rightBg: { type: "text", label: "Right BG", defaultValue: "#f8fafc" },
        panelPadding: {
          type: "number",
          label: "Panel Padding",
          defaultValue: 16,
        },
        panelRadius: { type: "number", label: "Panel Radius", defaultValue: 8 },
        panelMinHeight: {
          type: "number",
          label: "Panel Min Height",
          defaultValue: 100,
        },

        left: {
          type: "slot",
          label: "Left Column",
        },
        right: {
          type: "slot",
          label: "Right Column",
        },

        ...commonFields,
      },

      render: (props: any) => {
        const wrapperClass = props.stackOnMobile ? "puck-two-col-stack" : "";

        const wrapperStyle = combine(
          getSpacingStyle({
            ...props,
            paddingTop: props.paddingTop ?? 0,
            paddingRight: props.paddingRight ?? 0,
            paddingBottom: props.paddingBottom ?? 0,
            paddingLeft: props.paddingLeft ?? 0,
          }),
          getBoxStyle(props),
          getSizeStyle({
            ...props,
            widthMode: props.widthMode || "full",
            minHeight: props.minHeight || 0,
          }),
          {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: px(props.gap, 24),
          },
        );

        const panelBase: React.CSSProperties = {
          minHeight: px(props.panelMinHeight, 100),
          padding: px(props.panelPadding, 16),
          borderRadius: px(props.panelRadius, 8),
          border: "1px solid #e5e7eb",
        };

        return (
          <div
            id={props.id || undefined}
            className={props.className || undefined}
          >
            <style>{`
              @media (max-width: 768px) {
                .puck-two-col-stack {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>

            <div className={wrapperClass} style={wrapperStyle}>
              <div
                style={{ ...panelBase, background: props.leftBg || "#f8fafc" }}
              >
                <props.left />
              </div>

              <div
                style={{ ...panelBase, background: props.rightBg || "#f8fafc" }}
              >
                <props.right />
              </div>
            </div>
          </div>
        );
      },
    },
  },
};
