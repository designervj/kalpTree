import React from "react";
import { ProductShowcaseStyleConfig } from "./pages";
import {
  GripVertical,
  Home,
  FileText,
  MoreHorizontal,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Clock,
  ListPlus,
  Link2,
  Link as LinkLucide,
  Trash2,
  LayoutGrid,
  ListFilter,
  Settings,
  X,
  Palette,
  Type,
  Layout,
  Sparkles,
  Eye,
} from "lucide-react"

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked
          ? "bg-violet-600 dark:bg-violet-500"
          : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={checked}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}
// Style Sidebar Component
const StyleSidebar = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  config: ProductShowcaseStyleConfig;
  onConfigChange: (config: ProductShowcaseStyleConfig) => void;
}) => {
  const [activeGroup, setActiveGroup] = React.useState<string | null>("layout");

  const updateConfig = (
    section: keyof ProductShowcaseStyleConfig,
    key: string,
    value: any,
  ) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  const groups = [
    {
      id: "layout",
      label: "Layout",
      icon: <Layout className="w-4 h-4" />,
      sections: [
        {
          label: "Filter Position",
          type: "select",
          value: config.layoutConfig?.filterPosition || "sidebar",
          options: [
            { label: "Sidebar", value: "sidebar" },
            { label: "Top", value: "top" },
          ],
          onChange: (value: string) =>
            updateConfig("layoutConfig", "filterPosition", value),
        },
        {
          label: "Show Hero Section",
          type: "toggle",
          value: config.layoutConfig?.showHeroSection ?? true,
          onChange: (value: boolean) =>
            updateConfig("layoutConfig", "showHeroSection", value),
        },
        {
          label: "Hero Height",
          type: "text",
          value: config.layoutConfig?.heroHeight || "40vh",
          onChange: (value: string) =>
            updateConfig("layoutConfig", "heroHeight", value),
        },
        {
          label: "Grid Columns (Mobile)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.mobile || 1,
          min: 1,
          max: 3,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              mobile: value,
            }),
        },
        {
          label: "Grid Columns (Tablet)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.tablet || 2,
          min: 1,
          max: 4,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              tablet: value,
            }),
        },
        {
          label: "Grid Columns (Desktop)",
          type: "number",
          value: config.layoutConfig?.gridColumns?.desktop || 3,
          min: 1,
          max: 6,
          onChange: (value: number) =>
            updateConfig("layoutConfig", "gridColumns", {
              ...config.layoutConfig?.gridColumns,
              desktop: value,
            }),
        },
      ],
    },
    {
      id: "colors",
      label: "Colors & Theme",
      icon: <Palette className="w-4 h-4" />,
      sections: [
        {
          label: "Primary Color",
          type: "color",
          value: config.styleConfig?.primaryColor || "#000000",
          onChange: (value: string) =>
            updateConfig("styleConfig", "primaryColor", value),
        },
        {
          label: "Secondary Color",
          type: "color",
          value: config.styleConfig?.secondaryColor || "#666666",
          onChange: (value: string) =>
            updateConfig("styleConfig", "secondaryColor", value),
        },
        {
          label: "Accent Color",
          type: "color",
          value: config.styleConfig?.accentColor || "#2563eb",
          onChange: (value: string) =>
            updateConfig("styleConfig", "accentColor", value),
        },
        {
          label: "Button Style",
          type: "select",
          value: config.styleConfig?.buttonStyle || "square",
          options: [
            { label: "Square", value: "square" },
            { label: "Rounded", value: "rounded" },
            { label: "Pill", value: "pill" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "buttonStyle", value),
        },
        {
          label: "Card Style",
          type: "select",
          value: config.styleConfig?.cardStyle || "flat",
          options: [
            { label: "Flat", value: "flat" },
            { label: "Elevated", value: "elevated" },
            { label: "Bordered", value: "bordered" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "cardStyle", value),
        },
      ],
    },
    {
      id: "typography",
      label: "Typography",
      icon: <Type className="w-4 h-4" />,
      sections: [
        {
          label: "Font Family",
          type: "select",
          value: config.styleConfig?.fontFamily || "Montserrat",
          options: [
            { label: "Montserrat", value: "Montserrat" },
            { label: "Playfair Display", value: "Playfair Display" },
            { label: "Roboto", value: "Roboto" },
            { label: "Open Sans", value: "Open Sans" },
            { label: "Lato", value: "Lato" },
          ],
          onChange: (value: string) =>
            updateConfig("styleConfig", "fontFamily", value),
        },
        {
          label: "Title Size",
          type: "text",
          value: config.heroConfig?.titleSize || "4xl md:text-5xl",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleSize", value),
        },
        {
          label: "Title Tracking",
          type: "text",
          value: config.heroConfig?.titleTracking || "10px",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleTracking", value),
        },
      ],
    },
    {
      id: "hero",
      label: "Hero Section",
      icon: <Sparkles className="w-4 h-4" />,
      sections: [
        {
          label: "Title",
          type: "text",
          value: config.heroConfig?.title || "All Products",
          onChange: (value: string) =>
            updateConfig("heroConfig", "title", value),
        },
        {
          label: "Subtitle",
          type: "text",
          value: config.heroConfig?.subtitle || "",
          onChange: (value: string) =>
            updateConfig("heroConfig", "subtitle", value),
        },
        {
          label: "Background Image URL",
          type: "text",
          value: config.heroConfig?.backgroundImage || "",
          onChange: (value: string) =>
            updateConfig("heroConfig", "backgroundImage", value),
        },
        {
          label: "Overlay Opacity",
          type: "number",
          value: config.heroConfig?.overlayOpacity || 0.1,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (value: number) =>
            updateConfig("heroConfig", "overlayOpacity", value),
        },
        {
          label: "Title Color",
          type: "color",
          value: config.heroConfig?.titleColor || "#ffffff",
          onChange: (value: string) =>
            updateConfig("heroConfig", "titleColor", value),
        },
      ],
    },
    {
      id: "pagination",
      label: "Pagination",
      icon: <ChevronRight className="w-4 h-4" />,
      sections: [
        {
          label: "Enable Pagination",
          type: "toggle",
          value: config.paginationConfig?.enabled ?? true,
          onChange: (value: boolean) =>
            updateConfig("paginationConfig", "enabled", value),
        },
        {
          label: "Items Per Page",
          type: "number",
          value: config.paginationConfig?.itemsPerPage || 9,
          min: 3,
          max: 50,
          onChange: (value: number) =>
            updateConfig("paginationConfig", "itemsPerPage", value),
        },
        {
          label: "Position",
          type: "select",
          value: config.paginationConfig?.position || "bottom",
          options: [
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Both", value: "both" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "position", value),
        },
        {
          label: "Style",
          type: "select",
          value: config.paginationConfig?.style || "numbers",
          options: [
            { label: "Numbers", value: "numbers" },
            { label: "Simple", value: "simple" },
            { label: "Compact", value: "compact" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "style", value),
        },
        {
          label: "Button Shape",
          type: "select",
          value: config.paginationConfig?.buttonShape || "square",
          options: [
            { label: "Square", value: "square" },
            { label: "Rounded", value: "rounded" },
            { label: "Circular", value: "circular" },
          ],
          onChange: (value: string) =>
            updateConfig("paginationConfig", "buttonShape", value),
        },
      ],
    },
    {
      id: "filters",
      label: "Filters",
      icon: <ListFilter className="w-4 h-4" />,
      sections: [
        {
          label: "Show Category Filter",
          type: "toggle",
          value: config.filterConfig?.showCategoryFilter ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "showCategoryFilter", value),
        },
        {
          label: "Show Color Palette",
          type: "toggle",
          value: config.filterConfig?.showColorPalette ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "showColorPalette", value),
        },
        {
          label: "Enable Dynamic Filters",
          type: "toggle",
          value: config.filterConfig?.enableDynamicFilters ?? true,
          onChange: (value: boolean) =>
            updateConfig("filterConfig", "enableDynamicFilters", value),
        },
      ],
    },
    {
      id: "cards",
      label: "Product Cards",
      icon: <Eye className="w-4 h-4" />,
      sections: [
        {
          label: "Show Rating",
          type: "toggle",
          value: config.cardConfig?.showRating ?? true,
          onChange: (value: boolean) =>
            updateConfig("cardConfig", "showRating", value),
        },
        {
          label: "Show Sale Badge",
          type: "toggle",
          value: config.cardConfig?.showSaleBadge ?? true,
          onChange: (value: boolean) =>
            updateConfig("cardConfig", "showSaleBadge", value),
        },
        {
          label: "Image Aspect Ratio",
          type: "text",
          value: config.cardConfig?.imageAspectRatio || "3/4",
          onChange: (value: string) =>
            updateConfig("cardConfig", "imageAspectRatio", value),
        },
        {
          label: "Hover Effect",
          type: "select",
          value: config.cardConfig?.hoverEffect || "scale",
          options: [
            { label: "Scale", value: "scale" },
            { label: "Lift", value: "lift" },
            { label: "None", value: "none" },
          ],
          onChange: (value: string) =>
            updateConfig("cardConfig", "hoverEffect", value),
        },
        {
          label: "Placeholder Icon",
          type: "text",
          value: config.cardConfig?.placeholderIcon || "👕",
          onChange: (value: string) =>
            updateConfig("cardConfig", "placeholderIcon", value),
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Style Settings
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border-b border-slate-200 dark:border-slate-800"
          >
            <button
              onClick={() =>
                setActiveGroup(activeGroup === group.id ? null : group.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-violet-600 dark:text-violet-400">
                  {group.icon}
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {group.label}
                </span>
              </div>
              {activeGroup === group.id ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {activeGroup === group.id && (
              <div className="px-4 pb-4 space-y-4 bg-slate-50 dark:bg-slate-800/30">
                {group.sections.map((section: any, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {section.label}
                    </label>

                    {section.type === "text" && (
                      <input
                        type="text"
                        value={section.value}
                        onChange={(e) => section.onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    )}

                    {section.type === "number" && (
                      <input
                        type="number"
                        value={section.value}
                        min={section.min}
                        max={section.max}
                        step={section.step || 1}
                        onChange={(e) =>
                          section.onChange(parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    )}

                    {section.type === "color" && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={section.value}
                          onChange={(e) => section.onChange(e.target.value)}
                          className="h-10 w-20 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={section.value}
                          onChange={(e) => section.onChange(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    )}

                    {section.type === "select" && (
                      <select
                        value={section.value}
                        onChange={(e) => section.onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      >
                        {section.options?.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {section.type === "toggle" && (
                      <ToggleSwitch
                        checked={section.value}
                        onChange={section.onChange}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default StyleSidebar;   