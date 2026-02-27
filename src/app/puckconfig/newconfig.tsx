import {
  DEFAULT_BACKGROUND,
  getBackgroundCSS,
} from "@/components/puckcomponents/CustomBackground";
import {
  DEFAULT_BORDER,
  generateBorderCSS,
} from "@/components/puckcomponents/CustomBorder";
import {
  DEFAULT_BOX_SHADOW,
  generateBoxShadowCSS,
} from "@/components/puckcomponents/CustomBoxShadow";
import {
  DEFAULT_LAYOUT,
  generateLayoutCSS,
} from "@/components/puckcomponents/CustomLayout";
import {
  DEFAULT_SIZING,
  generateCSS,
} from "@/components/puckcomponents/CustomSIzing";
import {
  DEFAULT_SPACING,
  generateSpacingCSS,
} from "@/components/puckcomponents/CustomSpacing";
import {
  DEFAULT_TEXT,
  generateTextCSS,
  TextPanel,
} from "@/components/puckcomponents/CustomText";
import {
  accordionContentFields,
  DEFAULT_ACCORDION_CONTENT,
} from "@/components/puckcomponents/DirectComps/AccordianBlock";
import { AccordionComponentNew } from "@/components/puckcomponents/DirectComps/AccordionBlockNew";
import { AccordionItem } from "@/components/puckcomponents/DirectComps/AccordionItem";

import HeroSlider from "@/components/puckcomponents/DirectComps/Hero";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  backgroundFields,
  bodyTextFields,
  borderFields,
  boxShadowFields,
  closedTextFields,
  layoutFields,
  makeTextFields,
  sizingFields,
  spacingFields,
} from "./puckfields";

const HoverButtonWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleAddSection = (e: React.MouseEvent) => {
    console.log("Add section");
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="puck-hover-wrapper"
        style={{
          position: "relative",
          width: "100%",
          zIndex: isModalOpen ? 10000 : 1,
        }}
      >
        <style>{`
          .puck-hover-wrapper:hover {
            z-index: 1000 !important;
          }
          .puck-hover-wrapper::after {
            content: "";
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 20px;
            z-index: 999;
          }
          .puck-hover-wrapper .add-section-btn {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
            z-index: 10000 !important;
          }
          .puck-hover-wrapper:hover .add-section-btn {
            opacity: 1;
            pointer-events: auto;
          }
        `}</style>
        {children}
        <div
          className="add-section-btn"
          style={{
            position: "absolute",
            bottom: "-15px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
          }}
        >
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "6px 16px",
              borderRadius: "20px",
              border: "none",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              pointerEvents: "auto", // Explicitly ensure pointer events
            }}
            onClick={handleAddSection}
          >
            <span style={{ fontSize: "16px" }}>+</span> Add section
          </button>
        </div>
      </div>

      {isModalOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999, // Extremely high z-index
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                &times;
              </button>
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Add New Section
              </h2>
              <p style={{ color: "#4b5563", marginBottom: "24px" }}>
                Select a section type to add it below this component.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {["Hero", "Features", "Pricing", "Testimonials"].map((type) => (
                  <button
                    key={type}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      console.log(`Adding ${type} section...`);
                      setIsModalOpen(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export const newconfig = {
  // root: {
  //   fields: {
  //     navbar: {
  //       type: "slot",
  //       allowed: ["NavbarBlock"],
  //     },
  //   },

  //   render: ({ children, puck, ...props }: any) => {
  //     return (
  //       <div
  //         style={{
  //           minHeight: "100vh",
  //           display: "flex",
  //           flexDirection: "column",
  //         }}
  //       >
  //         <props.navbar />
  //         {/* Page content */}
  //         <main className="h-[90vh]" style={{ flex: 1 }}>
  //           {children}
  //         </main>
  //       </div>
  //     );
  //   },
  // },
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

    TextBlock: {
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
          <HoverButtonWrapper>
            <h1 style={{ ...textstyle }}>Himanshu</h1>
          </HoverButtonWrapper>
        );
      },
    },

    HeroSection: {
      render: (props: any) => {
        return (
          <HoverButtonWrapper>
            <HeroSlider />
          </HoverButtonWrapper>
        );
      },
    },

    // Accordion: {
    //   fields: {
    //     layout: layoutFields,
    //     sizing: sizingFields,
    //     spacing: spacingFields,
    //     border: borderFields,
    //     boxShadow: boxShadowFields,
    //     accordion: accordionContentFields,
    //   },
    //   defaultProps: {
    //     boxShadow: DEFAULT_BOX_SHADOW,
    //     layout: DEFAULT_LAYOUT,
    //     sizing: DEFAULT_SIZING,
    //     spacing: DEFAULT_SPACING,
    //     border: DEFAULT_BORDER,
    //     accordion: DEFAULT_ACCORDION_CONTENT,
    //   },
    //   render: (props: any) => {
    //     // compute CSS from field values and render your accordion UI
    //     return (

    //         <AccordionComponent {...props} />

    //     );
    //   },
    // },
    AccordionItem: {
      fields: {
        title: {
          type: "text",
          label: "Title",
          defaultValue: "Accordion Title",
          contentEditable: true,
        },
        body: {
          type: "textarea",
          label: "Body",
          defaultValue: "Content goes here.",
          contentEditable: true,
        },
        titletext: makeTextFields,
        closedtitletext: closedTextFields,
        bodytext: bodyTextFields,
        sizing: sizingFields,
        spacing: spacingFields,
        border: borderFields,
        boxShadow: boxShadowFields,
      },
      defaultProps: {
        titletext: DEFAULT_TEXT,
        closedtitletext: DEFAULT_TEXT,
        bodytext: DEFAULT_TEXT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        boxShadow: DEFAULT_BOX_SHADOW,
      },
      render: (props: any) => {
        return <AccordionItem {...props} />;
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
        content: {
          type: "slot",
          allow: ["AccordionItem"],
        },
      },
      defaultProps: {
        boxShadow: DEFAULT_BOX_SHADOW,
        layout: DEFAULT_LAYOUT,
        sizing: DEFAULT_SIZING,
        spacing: DEFAULT_SPACING,
        border: DEFAULT_BORDER,
        accordion: DEFAULT_ACCORDION_CONTENT,
        // content: [
        //   {
        //     type: "HeadingBlock",
        //     props: {
        //       text: {
        //         activeTag: "H1",
        //         h1: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "30",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         h2: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "24",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         h3: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "20",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         h4: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "18",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         h5: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "16",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         h6: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "14",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //         p: {
        //           font: "Default",
        //           fontWeight: "Regular",
        //           fontStyle: "normal",
        //           textAlign: "left",
        //           color: "",
        //           fontSize: {
        //             value: "14",
        //             unit: "px",
        //           },
        //           letterSpacing: {
        //             value: "0",
        //             unit: "px",
        //           },
        //           lineHeight: {
        //             value: "1",
        //             unit: "em",
        //           },
        //           textShadow: 0,
        //         },
        //       },
        //       id: "HeadingBlock-f77653fc-4dd1-4c9b-8db0-3ca9506d7ebd",
        //     },
        //   },
        // ],
      },

      render: (props: any) => {
        // compute CSS from field values and render your accordion UI
        return <AccordionComponentNew {...props} />;
      },
    },
  },
};
