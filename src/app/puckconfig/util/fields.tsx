import {
  DEFAULT_SIZING,
  SizingPanel,
} from "@/components/puckcomponents/CustomSIzing";
import {
  DEFAULT_SPACING,
  SpacingPanel,
} from "@/components/puckcomponents/CustomSpacing";
import {
  DEFAULT_BORDER,
  BorderPanel,
} from "@/components/puckcomponents/CustomBorder";
import {
  DEFAULT_LAYOUT,
  LayoutPanel,
} from "@/components/puckcomponents/CustomLayout";
import {
  DEFAULT_BOX_SHADOW,
  BoxShadowPanel,
} from "@/components/puckcomponents/CustomBoxShadow";
import {
  DEFAULT_TEXT,
  TextPanel,
} from "@/components/puckcomponents/CustomText";
import {
  DEFAULT_BACKGROUND,
  BackgroundPanel,
} from "@/components/puckcomponents/CustomBackground";
import React from "react";

export const sizingFields = {
  type: "custom",
  label: "Sizing",
  defaultValue: DEFAULT_SIZING,
  render: (data: any) => {
    const { field, onChange, value } = data;
    const safeValue = value ? { ...DEFAULT_SIZING, ...value } : DEFAULT_SIZING;

    const update = (key: string, val: any) => {
      onChange({ ...safeValue, [key]: val });
    };

    return <SizingPanel updateField={update} sizing={safeValue} />;
  },
};

export const spacingFields = {
  type: "custom",
  label: "Spacing",
  defaultValue: DEFAULT_SPACING,
  render: (data: any) => {
    const { onChange, value } = data;
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

    return (
      <TextPanel
        updateField={updateField}
        text={safeValue}
        textlabel={"Text"}
      />
    );
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
