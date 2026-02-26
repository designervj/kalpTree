import {
  BackgroundPanel,
  DEFAULT_BACKGROUND,
  getBackgroundCSS,
} from "@/components/puckcomponents/CustomBackground";
import {
  BorderPanel,
  DEFAULT_BORDER,
  generateBorderCSS,
} from "@/components/puckcomponents/CustomBorder";
import {
  BoxShadowPanel,
  BoxShadowState,
  DEFAULT_BOX_SHADOW,
  generateBoxShadowCSS,
} from "@/components/puckcomponents/CustomBoxShadow";
import {
  DEFAULT_LAYOUT,
  generateLayoutCSS,
  LayoutPanel,
} from "@/components/puckcomponents/CustomLayout";
import {
  DEFAULT_SIZING,
  generateCSS,
  SizingPanel,
} from "@/components/puckcomponents/CustomSIzing";
import {
  DEFAULT_SPACING,
  generateSpacingCSS,
  SpacingPanel,
} from "@/components/puckcomponents/CustomSpacing";
import {
  DEFAULT_TEXT,
  generateTextCSS,
  TextPanel,
} from "@/components/puckcomponents/CustomText";
import {
  AccordionComponent,
  accordionContentFields,
  DEFAULT_ACCORDION_CONTENT,
} from "@/components/puckcomponents/DirectComps/AccordianBlock";

import HeroSlider from "@/components/puckcomponents/DirectComps/Hero";
import * as React from "react";

export const sizingFields = {
  type: "custom",
  label: "Sizing",
  defaultValue: DEFAULT_SIZING,
  render: (data: any) => {
    const { field, onChange, value } = data;

    const update = (key: string, val: string) => {
      onChange({ ...value, [key]: val });
    };

    const safeValue = value ? { ...DEFAULT_SIZING, ...value } : DEFAULT_SIZING;

    return <SizingPanel updateField={update} sizing={safeValue} />;
  },
};

export const spacingFields = {
  type: "custom",
  label: "Spacing",
  defaultValue: DEFAULT_SPACING,
  render: (data: any) => {
    const { onChange, field, value } = data;

    const safeValue = value
      ? { ...DEFAULT_SPACING, ...value }
      : DEFAULT_SPACING;

    return <SpacingPanel onChange={onChange} spacing={safeValue} />;
  },
};

export const borderFields = {
  type: "custom",
  label: "Border",
  defaultValue: DEFAULT_BORDER,
  render: (data: any) => {
    const { onChange, value, field } = data;

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

export const makeTextFields = {
  type: "custom",
  label: "Text",
  defaultValue: DEFAULT_TEXT,
  render: (data: any) => {
    const { onChange, value } = data;

    const safeValue = value ? { ...DEFAULT_TEXT, ...value } : DEFAULT_TEXT;

    const updateField = (key: string, val: any) => {
      onChange({ ...safeValue, [key]: val });
    };

    return <TextPanel updateField={updateField} text={safeValue} />;
  },
};

export const backgroundFields = {
  type: "custom" as const,
  label: "Background",
  defaultValue: DEFAULT_BACKGROUND,
  render: (data: any) => {
    const { onChange, value } = data;
    const safeValue = value
      ? { ...DEFAULT_BACKGROUND, ...value }
      : DEFAULT_BACKGROUND;
    const updateField = (key: string, val: any) =>
      onChange({ ...safeValue, [key]: val });
    return <BackgroundPanel updateField={updateField} background={safeValue} />;
  },
};

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
    Container: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        content: {
          type: "slot",
        },
        background: backgroundFields,
      },
      defaultProps: {
        boxShadow: DEFAULT_BOX_SHADOW,
        layout: DEFAULT_LAYOUT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        background: DEFAULT_BACKGROUND,
      },

      render: (props: any) => {
        const { layout, sizing, spacing, border, boxShadow, background } =
          props;
        const sizestyle = generateCSS(sizing);
        const borderstyle = generateBorderCSS(border);
        const spacingstyle = generateSpacingCSS(spacing);
        const boxshadowstyle = generateBoxShadowCSS(boxShadow);
        const layoutstyle = generateLayoutCSS(layout);
        const backgroundstyle = getBackgroundCSS(background);

        return (
          <props.content
            style={{
              ...sizestyle,
              ...borderstyle,
              ...spacingstyle,
              ...boxshadowstyle,
              ...layoutstyle,
              ...backgroundstyle,
            }}
          />
        );
      },
    },

    HeadingBlock: {
      fields: {
        text: makeTextFields,
      },
      defaultProps: {
        text: DEFAULT_TEXT,
      },
      render: (props: any) => {
        const { text } = props;
        const textstyle = generateTextCSS(text[text.activeTag.toLowerCase()]);

        console.log(text, textstyle);

        return <h1 style={{ ...textstyle }}>Himanshu</h1>;
      },
    },

    HeroSection: {
      render: (props: any) => {
        return <HeroSlider />;
      },
    },

    Accordion: {
      fields: {
        layout: layoutFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
        accordion: accordionContentFields,
      },
      defaultProps: {
        boxShadow: DEFAULT_BOX_SHADOW,
        layout: DEFAULT_LAYOUT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        accordion: DEFAULT_ACCORDION_CONTENT,
      },
      render: (props: any) => {
        // compute CSS from field values and render your accordion UI
        return <AccordionComponent {...props} />;
      },
    },
  },
};
