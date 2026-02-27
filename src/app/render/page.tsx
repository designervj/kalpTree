"use client";

import { Render } from "@puckeditor/core";
import { useEffect, useState } from "react";
import { newconfig } from "../puckconfig/newconfig";
import matter from "gray-matter";
import { compileMDX } from "../puckbuilder/Editor";
import * as framerMotion from "framer-motion";

const initialData = {
  root: {
    props: {
      navbar: [],
    },
  },
  content: [
    {
      type: "HeroSection",
      props: {
        id: "HeroSection-874c8567-006f-4eaf-8fbf-6ed5df1bf7f3",
      },
    },
  ],
  zones: {},
};

export default function RenderPage() {
  const [config, setConfig] = useState<any>(newconfig);
  const [loading, setLoading] = useState(true);

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

  return <Render config={config} data={initialData} />;
}
