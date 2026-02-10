export type FormMode = "standalone" | "connected";
export type SubmitAction = "message" | "link";
export type BtnPos = "left" | "center" | "right";
export type StyleElement = "form_fields" | "button" | "labels";
export type StyleState = "normal" | "hover";
export type Anim = "none" | "fade" | "slide" | "scale";

/** ✅ New field input types as per screenshot */
export type FieldInputType = "short" | "paragraph" | "single" | "multi";

export type FormField = {
    id: string;
    label: string;

    enabled: boolean;
    required: boolean;

    inputType: FieldInputType;
    placeholder: string;

    requiredMessage: string;

    // only for single/multi choice
    options: string[];
};

export type FormSettings = {
    // General
    mode: FormMode;
    formName: string;
    notifyEmail: string;

    // Fields
    fields: FormField[];

    // Button
    buttonText: string;
    stretchOnMobile: boolean;
    buttonPosition: BtnPos;
    submitAction: SubmitAction;
    thankYouMessage: string;
    redirectUrl: string;

    // Style
    styleElement: StyleElement;
    styleState: StyleState;
    fillColor: string;
    fontFamily: string;
    labelTextColor: string;
    labelTextSize: number;
    fieldTextColor: string;
    fieldTextSize: number;
    borderColor: string;
    borderWidth: number;
    cornerRadius: number;
    spacing: number;

    // Animation
    animation: Anim;
};
