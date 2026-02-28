"use client";

import { EditorUI } from "@/components/puckcomponents/PuckOveride/EditorUI";
import { ActionBar, Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { newconfig } from "../puckconfig/newconfig";
import matter from "gray-matter";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import * as framerMotion from "framer-motion";
import { useEffect, useState } from "react";
import { ContainerSecondaryActions } from "@/components/puckcomponents/PuckOveride/ActionBarOver";
import { RowOverlay } from "@/components/puckcomponents/PuckOveride/RowOverlay";
import { FieldsOveride } from "@/components/puckcomponents/PuckOveride/FieldsOverride";

const initialData = {
  // root: {
  //   props: {
  //     navbar: [],
  //   },
  // },
  // content: [
  //   {
  //     type: "HeroSection",
  //     props: {
  //       id: "HeroSection-874c8567-006f-4eaf-8fbf-6ed5df1bf7f3",
  //     },
  //   },
  // ],
  // zones: {},
};

const save = (data: any) => console.log(data);

export async function compileMDX(
  mdxContent: string,
): Promise<React.ComponentType<any>> {
  const { default: MDXComponent } = await evaluate(mdxContent, {
    ...(runtime as any),
  });
  return MDXComponent;
}

export function Editor() {
  const [config, setConfig] = useState<any>(newconfig);
  const [loading, setLoading] = useState(true);
  const [openComponentModel, setOpenComponentModel] = useState(false);

  const handleOpemComponentModal = () => {
    setOpenComponentModel((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/hero.mdx");
        const text = await res.text();
        const { content, data: frontmatter } = matter(text);
        const CompiledHero = await compileMDX(content);

        const HeroBlock = {
          label: "Hero Block (MDX)",
          fields: {
            heading: { type: "text" as const, label: "Heading" },
            subheading: { type: "text" as const, label: "Subheading" },
            primaryButtonLabel: {
              type: "text" as const,
              label: "Primary Button",
            },
            primaryButtonHref: {
              type: "text" as const,
              label: "Primary Button URL",
            },
            secondaryButtonLabel: {
              type: "text" as const,
              label: "Secondary Button",
            },
            background: {
              type: "text" as const,
              label: "Background (CSS gradient or color)",
            },
          },
          defaultProps: {
            heading: frontmatter.heading ?? "Build Faster. Ship Smarter.",
            subheading:
              frontmatter.subheading ??
              "The modern platform for teams who want to move fast.",
            primaryButtonLabel: frontmatter.primaryBtn ?? "Get Started",
            primaryButtonHref: frontmatter.primaryHref ?? "#",
            secondaryButtonLabel: frontmatter.secondaryBtn ?? "Learn More",
            background:
              frontmatter.background ??
              "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
          },
          render: (props: any) => (
            <CompiledHero {...props} motion={framerMotion.motion} />
          ),
        };

        setConfig((prev: any) => ({
          ...prev,
          components: { ...prev.components, HeroBlock },
        }));
      } catch (err) {
        console.error("Failed to load MDX block:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const overrides = {
    actionBar: ({ children, label }: any) => (
      <ActionBar label={label}>
        <ActionBar.Group>
          {children}
          <ContainerSecondaryActions
            handleOpemComponentModal={handleOpemComponentModal}
          />
        </ActionBar.Group>
      </ActionBar>
    ),

    componentOverlay: ({ children, hover }: any) => (
      <RowOverlay
        onAddComponent={handleOpemComponentModal}
        hovered={hover}
        children={children}
      />
    ),
    fields: ({ children, isLoading, itemSelector }: any) => (
      <FieldsOveride
        children={children}
        isLoading={isLoading}
        itemSelector={itemSelector}
      />
    ),
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0d0d0d",
          color: "#555",
          fontFamily: "monospace",
          fontSize: 13,
          letterSpacing: "0.08em",
        }}
      >
        loading blocks...
      </div>
    );
  }

  return (
    <Puck
      iframe={{
        enabled: true,
      }}
      config={config}
      data={initialData}
      onPublish={save}
      overrides={overrides}
    >
      <EditorUI
        openComponentModel={openComponentModel}
        handleOpemComponentModal={handleOpemComponentModal}
      />
    </Puck>
  );
}
