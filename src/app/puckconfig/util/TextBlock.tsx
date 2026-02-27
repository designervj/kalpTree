import React from "react";
import { makeTextFields } from "./fields";
import {
    DEFAULT_TEXT,
    generateTextCSS,
} from "@/components/puckcomponents/CustomText";

export const TextBlock = {
      fields: {
        text: makeTextFields,
      },
      defaultProps: {
        text: DEFAULT_TEXT,
      },
      render: (props: any) => {
        const { text } = props;
        const textstyle = generateTextCSS(text[text.activeTag.toLowerCase()]);

        return (
          <h1 style={{ ...textstyle }}>Himanshu</h1>
        );
      },
    };