"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store/store";
import {
  CheckCircle2,
  Layout,
  Pencil,
  Trash2,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { TemplateDocument } from "../templates/TemplateType";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import { useRouter } from "next/navigation";
import ShowHeaderHtml from "./ShowHeaderHtml";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * UI Theme tokens
 */
const UI_THEME = {
  fonts: {
    primary: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  colors: {
    cardBorder: "#cdc3f6",
    cardBg: "#fbfaff",

    topBarBg: "#f4f1ff",
    topBarBorder: "#d8cff8",

    idLabel: "#5f63a7",
    idValue: "#4b5563",

    title: "#1f6f43",
    subtitle: "#6b7280",

    titlesecond: "#000",
    subtitlesecond: "#6b7280",

    previewBorder: "#cfc3fb",
    previewBg: "#f8f7ff",

    link: "#6b63b6",
    linkHover: "#4f46e5",

    applyBtn: "#059669",
    applyBtnHover: "#047857",

    menuIcon: "#4b5563",
    danger: "#e11d48",
  },
};

type HeaderUiStyle = {
  titleColor: string;
  subtitleColor: string;
  fontFamily: string;
};

const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Poppins", value: "Poppins, ui-sans-serif, system-ui, sans-serif" },
  { label: "Montserrat", value: "Montserrat, ui-sans-serif, system-ui, sans-serif" },
  { label: "Roboto", value: "Roboto, ui-sans-serif, system-ui, sans-serif" },
  { label: "Open Sans", value: "'Open Sans', ui-sans-serif, system-ui, sans-serif" },
  { label: "Lora", value: "Lora, Georgia, serif" },
];

const isValidHexColor = (value: string) =>
  /^#([0-9A-Fa-f]{6})$/.test(value.trim());

const ShowCurrentHeader = () => {
  const { websiteHeader, hasFetched } = useSelector(
    (state: RootState) => state.header
  );
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { curretAgency } = useSelector((state: RootState) => state.agency);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [headerStyleMap, setHeaderStyleMap] = useState<
    Record<string, HeaderUiStyle>
  >({});

  const getHeaderStyle = (headerId: string): HeaderUiStyle => {
    return (
      headerStyleMap[headerId] || {
        titleColor: UI_THEME.colors.title,
        subtitleColor: UI_THEME.colors.subtitle,
        fontFamily: UI_THEME.fonts.primary,
      }
    );
  };

  const updateHeaderStyle = (headerId: string, patch: Partial<HeaderUiStyle>) => {
    setHeaderStyleMap((prev) => {
      const current =
        prev[headerId] || {
          titleColor: UI_THEME.colors.title,
          subtitleColor: UI_THEME.colors.subtitle,
          fontFamily: UI_THEME.fonts.primary,
        };

      return {
        ...prev,
        [headerId]: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const handleBuilderEdit = (header: TemplateDocument) => {
    if (!header._id || !header.websiteId) return;

    dispatch(
      setPageEdit({
        page: header,
        type: "header",
      })
    );

    window.open(
      `/header?id=${header._id.toString()}&websiteId=${header.websiteId.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDelete = (header: TemplateDocument) => {
    console.log("Delete clicked:", header?._id?.toString());
  };

  const handleApplyHeader = (header: TemplateDocument) => {
    console.log("Apply clicked:", header?._id?.toString());
  };

  const handleEditHeader = (header: TemplateDocument) => {
    if (!header._id) return;

    router.push(
      `/admin/websites/${currentWebsite?.primaryDomain?.[0]}/website/header/${header._id.toString()}?businessid=${currentBusiness?._id}&agencyid=${curretAgency?._id}`
    );
  };

  if (!hasFetched) {
    return (
      <div
        className="rounded-2xl border bg-white p-8 shadow-sm"
        style={{ borderColor: "#d9cffc" }}
      >
        <div
          className="flex h-[220px] items-center justify-center rounded-xl border border-dashed bg-[#faf8ff]"
          style={{ borderColor: "#d9cffc" }}
        >
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: UI_THEME.fonts.primary }}
          >
            Loading header...
          </p>
        </div>
      </div>
    );
  }

  if (!websiteHeader || websiteHeader.length === 0) {
    return (
      <div
        className="rounded-2xl border bg-white p-8 shadow-sm"
        style={{ borderColor: "#d9cffc" }}
      >
        <div
          className="flex h-[220px] items-center justify-center rounded-xl border border-dashed bg-[#faf8ff]"
          style={{ borderColor: "#d9cffc" }}
        >
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: UI_THEME.fonts.primary }}
          >
            No header linked with this website
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {websiteHeader.map((header: TemplateDocument, index: number) => {
        const domain =
          currentWebsite?.primaryDomain?.[0] ||
          header?.websiteId?.toString() ||
          "website-domain";

        const headerId = header?._id?.toString() || `header-${index}`;
        const uiStyle = getHeaderStyle(headerId);

        const selectedFontLabel =
          FONT_OPTIONS.find((f) => f.value === uiStyle.fontFamily)?.label ||
          "Custom";

        return (
          <div
            key={headerId}
            className="overflow-hidden rounded-2xl border shadow-sm"
            style={{
              borderColor: UI_THEME.colors.cardBorder,
              background: UI_THEME.colors.cardBg,
              fontFamily: UI_THEME.fonts.primary,
            }}
          >
            {/* Top title bar */}
            <div
              className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-6"
              style={{
                borderColor: UI_THEME.colors.topBarBorder,
                background: UI_THEME.colors.topBarBg,
              }}
            >
              {/* Middle: title + domain + ID */}
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-sm font-semibold tracking-wide"
                  title="Website Header Preview"
                >
                  Website Header Preview
                </div>

                {/* ✅ ONLY ADDED: Website URL / domain name (no other design changes) */}
                {/* <div
                  className="truncate text-xs"
                  style={{
                    fontFamily: UI_THEME.fonts.primary,
                    color: UI_THEME.colors.subtitlesecond,
                  }}
                  title={domain}
                >
                  {domain}
                </div> */}

                <p
                  className="max-w-[290px] truncate text-sm"
                  style={{
                    color: UI_THEME.colors.idLabel,
                    fontFamily: UI_THEME.fonts.primary,
                  }}
                >
                  ID:{" "}
                  <span
                    style={{
                      color: UI_THEME.colors.idValue,
                      fontFamily: UI_THEME.fonts.mono,
                    }}
                  >
                    {header?._id?.toString() || "N/A"}
                  </span>
                </p>
              </div>

              {/* Marked Area: color preview + color code + font family */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                {/* Color preview */}
                <div className="flex items-center gap-1.5 rounded-md border border-[#d7cff5] bg-white px-1 py-1">
                  <span
                    className="inline-block h-6 w-6 rounded border"
                    style={{ backgroundColor: uiStyle.titleColor }}
                    title="Title color preview"
                  />
                </div>

                {/* Color code input */}
                <input
                  type="text"
                  value={uiStyle.titleColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateHeaderStyle(headerId, {
                      titleColor: value,
                      subtitleColor: value,
                    });
                  }}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!isValidHexColor(v)) {
                      updateHeaderStyle(headerId, {
                        titleColor: UI_THEME.colors.title,
                        subtitleColor: UI_THEME.colors.subtitle,
                      });
                    }
                  }}
                  placeholder="#1f6f43"
                  className="h-8 w-[104px] rounded-md border border-[#d7cff5] bg-white px-2 text-xs outline-none focus:border-[#b9a9ff]"
                  style={{
                    fontFamily: UI_THEME.fonts.mono,
                    color: "#334155",
                  }}
                  title="Color code"
                />

                <div className="flex items-center gap-1.5 rounded-md border border-[#d7cff5] bg-white px-1 py-1">
                  <span
                    className="inline-block h-6 w-6 rounded border"
                    style={{ backgroundColor: uiStyle.titleColor }}
                    title="Title color preview"
                  />
                </div>

                <input
                  type="text"
                  value={uiStyle.titleColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateHeaderStyle(headerId, {
                      titleColor: value,
                      subtitleColor: value,
                    });
                  }}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!isValidHexColor(v)) {
                      updateHeaderStyle(headerId, {
                        titleColor: UI_THEME.colors.title,
                        subtitleColor: UI_THEME.colors.subtitle,
                      });
                    }
                  }}
                  placeholder="#000"
                  className="h-8 w-[104px] rounded-md border border-[#d7cff5] bg-white px-2 text-xs outline-none focus:border-[#b9a9ff]"
                  style={{
                    fontFamily: UI_THEME.fonts.mono,
                    color: "#334155",
                  }}
                  title="Color code"
                />

                {/* Font family display */}
                <div
                  className="flex h-8 min-w-[150px] items-center rounded-md border border-[#d7cff5] bg-white px-2 text-xs"
                  style={{
                    fontFamily: UI_THEME.fonts.primary,
                    color: "#334155",
                  }}
                  title={`Font family (${selectedFontLabel})`}
                >
                  <span className="truncate">{selectedFontLabel}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5">
                <Button
                  type="button"
                  onClick={() => handleApplyHeader(header)}
                  className="h-10 cursor-pointer rounded-xl px-4 text-white"
                  style={{
                    fontFamily: UI_THEME.fonts.primary,
                    backgroundColor: UI_THEME.colors.applyBtn,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      UI_THEME.colors.applyBtnHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      UI_THEME.colors.applyBtn;
                  }}
                >
                  <CheckCircle2 className=" h-4 w-4" />
                  Apply
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical
                        className="h-4 w-4"
                        style={{ color: UI_THEME.colors.menuIcon }}
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => handleEditHeader(header)}>
                      <Pencil className="mr-2 h-4 w-4 text-emerald-600" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleBuilderEdit(header)}>
                      <Layout className="mr-2 h-4 w-4 text-emerald-600" />
                      Builder
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDelete(header)}
                      className="focus:text-rose-600"
                      style={{ color: UI_THEME.colors.danger }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6">
              {/* Preview box */}
              <div
                className="overflow-hidden rounded-2xl border bg-white"
                style={{ borderColor: UI_THEME.colors.previewBorder }}
              >
                <div
                  className="p-0"
                  style={{ backgroundColor: UI_THEME.colors.previewBg }}
                >
                  <div className="h-[150px] overflow-hidden bg-white">
                    <ShowHeaderHtml html={header?.content || ""} />
                  </div>
                </div>
              </div>

              {/* Open builder link */}
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleBuilderEdit(header)}
                  className="inline-flex items-center gap-1 text-xs font-medium"
                  style={{
                    color: UI_THEME.colors.link,
                    fontFamily: uiStyle.fontFamily,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = UI_THEME.colors.linkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = UI_THEME.colors.link;
                  }}
                >
                  Open Builder
                  <ExternalLink className="h-3.5 w-3.5 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowCurrentHeader;
