import {
  BorderPanel,
  DEFAULT_BORDER,
} from "@/components/puckcomponents/CustomBorder";
import {
  BoxShadowPanel,
  BoxShadowState,
  DEFAULT_BOX_SHADOW,
} from "@/components/puckcomponents/CustomBoxShadow";
import {
  DEFAULT_LAYOUT,
  LayoutPanel,
} from "@/components/puckcomponents/CustomLayout";
import {
  DEFAULT_SIZING,
  SizingPanel,
} from "@/components/puckcomponents/CustomSIzing";
import { SpacingPanel } from "@/components/puckcomponents/CustomSpacing";
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

// const layout = {
//   type: "object",
//   objectFields: {
//     display: {
//       type: "select",
//       options: [
//         {
//           value: "flex",
//           label: "Flex",
//         },
//         {
//           value: "grid",
//           label: "Grid",
//         },
//       ],
//     },
//   },
//   label: "Layout",
//   defaultExpanded: false,
// };

export const sizingFields = {
  type: "custom",
  label: "Sizing",
  defaultValue: {
    width: { value: "", unit: "auto" },
    maxWidth: { value: "", unit: "none" },
    sectionAlignment: "center",
    minHeight: { value: "", unit: "auto" },
    height: { value: "", unit: "auto" },
    maxHeight: { value: "", unit: "none" },
  },
  render: (data: any) => {
    const { field, id, label, name, onChange, value } = data;

    const update = (key: string, val: string) => {
      onChange({ ...value, [key]: val });
    };

    const safeValue = value
      ? { ...field.defaultValue, ...value }
      : field.defaultValue;

    return <SizingPanel updateField={update} sizing={safeValue} />;
  },
};

export const spacingFields = {
  type: "custom",
  label: "Spacing",
  defaultValue: {
    marginTop: { value: "0", unit: "px" },
    marginBottom: { value: "0", unit: "px" },
    marginLeft: { value: "", unit: "px" },
    marginRight: { value: "", unit: "px" },
    paddingTop: { value: "", unit: "px" },
    paddingBottom: { value: "", unit: "px" },
    paddingLeft: { value: "", unit: "px" },
    paddingRight: { value: "", unit: "px" },
  },
  render: (data: any) => {
    const { onChange, field, value } = data;

    const safeValue = value
      ? { ...field.defaultValue, ...value }
      : field.defaultValue;

    return <SpacingPanel onChange={onChange} spacing={safeValue} />;
  },
};

// export const flexFields = {
//   flexDirection: {
//     type: "radio",
//     label: "Direction",
//     options: [
//       { label: "Row", value: "row" },
//       { label: "Column", value: "column" },
//       { label: "Row Reverse", value: "row-reverse" },
//       { label: "Column Reverse", value: "column-reverse" },
//     ],
//     defaultValue: "row",
//   },

//   justifyContent: {
//     type: "radio",
//     label: "Justify Content",
//     options: [
//       { label: "Start", value: "flex-start" },
//       { label: "Center", value: "center" },
//       { label: "End", value: "flex-end" },
//       { label: "Between", value: "space-between" },
//       { label: "Around", value: "space-around" },
//       { label: "Evenly", value: "space-evenly" },
//     ],
//     defaultValue: "flex-start",
//   },

//   alignItems: {
//     type: "radio",
//     label: "Align Items",
//     options: [
//       { label: "Stretch", value: "stretch" },
//       { label: "Start", value: "flex-start" },
//       { label: "Center", value: "center" },
//       { label: "End", value: "flex-end" },
//       { label: "Baseline", value: "baseline" },
//     ],
//     defaultValue: "stretch",
//   },

//   alignContent: {
//     type: "radio",
//     label: "Align Content",
//     options: [
//       { label: "Start", value: "flex-start" },
//       { label: "Center", value: "center" },
//       { label: "End", value: "flex-end" },
//       { label: "Between", value: "space-between" },
//       { label: "Around", value: "space-around" },
//       { label: "Stretch", value: "stretch" },
//     ],
//   },

//   flexWrap: {
//     type: "radio",
//     label: "Wrap",
//     options: [
//       { label: "No Wrap", value: "nowrap" },
//       { label: "Wrap", value: "wrap" },
//       { label: "Wrap Reverse", value: "wrap-reverse" },
//     ],
//     defaultValue: "nowrap",
//   },

//   gap: {
//     type: "number",
//     label: "Gap",
//     defaultValue: 0,
//   },
// };

export const borderFields = {
  type: "custom",
  label: "Border",
  defaultValue: DEFAULT_BORDER,
  render: (data: any) => {
    const { onChange, value } = data;

    const safeValue = value ? { ...DEFAULT_BORDER, ...value } : DEFAULT_BORDER;

    const updateField = (key: string, val: any) => {
      onChange({ ...safeValue, [key]: val });
    };

    return (
      <BorderPanel
        updateField={updateField}
        border={safeValue}
        onChange={onChange}
      />
    );
  },
};

export const layoutFields = {
  type: "custom",
  label: "Layout",
  defaultValue: DEFAULT_LAYOUT,
  render: (data: any) => {
    const { onChange, value } = data;

    const safeValue = value ? { ...DEFAULT_LAYOUT, ...value } : DEFAULT_LAYOUT;

    const updateField = (key: string, val: any) => {
      onChange({ ...safeValue, [key]: val });
    };

    return <LayoutPanel updateField={updateField} layout={safeValue} />;
  },
};

export const boxShadowFields = {
  type: "custom",
  label: "Box Shadow",
  defaultValue: DEFAULT_BOX_SHADOW,
  render: (data: any) => {
    const { onChange, value } = data;

    const safeValue = value
      ? { ...DEFAULT_BOX_SHADOW, ...value }
      : DEFAULT_BOX_SHADOW;

    React.useEffect(() => {
      onChange({ ...safeValue });
    }, []);

    const updateField = (key: string, val: any) => {
      onChange({ ...safeValue, [key]: val });
    };

    return (
      <BoxShadowPanel
        updateField={updateField}
        shadow={safeValue}
        onChange={onChange}
      />
    );
  },
};

const CustomSlot = (props: any) => {
  return <span {...props} />;
};

// ---------- Config ----------

export const newconfig = {
  root: {
    fields: {
      navbar: {
        type: "slot",
        allowed: ["NavbarBlock"],
      },
    },

    render: ({ children, puck, ...props }: any) => {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <props.navbar />
          {/* Page content */}
          <main className="h-[90vh]" style={{ flex: 1 }}>
            {children}
          </main>
        </div>
      );
    },
  },

  components: {
    // --------------------------------------------------
    // Grid Container (NEW) - droppable grid wrapper
    // --------------------------------------------------
    Container: {
      fields: {
        layoutFields: layoutFields,
        sizingFields: sizingFields,
        spacingFields: spacingFields,
        borderFields: borderFields,
        boxShadowFields: boxShadowFields,
        content: {
          type: "slot",
        },
      },
      //   resolveFields: (data: any, { fields }: any) => {
      //     const baseFields = {
      //       layout: fields.layout,
      //       content: fields.content,
      //       sizingFields: fields.sizingFields,
      //       spacingFields: fields.spacingFields,
      //       borderFields: fields.borderFields,
      //       boxShadowFields: fields.boxShadowFields,
      //     };

      //     if (data.props.layout && data.props.layout.display == "flex") {
      //       const cloned = structuredClone(baseFields);
      //       cloned.layout.objectFields = {
      //         ...cloned.layout.objectFields,
      //         ...flexFields,
      //       };
      //       return cloned;
      //     }

      //     return baseFields;
      //   },

      render: (props: any) => {
        return (
          <section>
            <props.content
              id={props.id || undefined}
              className={props.className || undefined}
              as={CustomSlot}
            />
          </section>
        );
      },
    },
  },
};
