"use client";

import React from "react";
import {
  PencilLine,
  CalendarDays,
  Globe2,
  Grip,
  FileText,
  BarChart3,
  Image as ImageIcon,
  Languages,
  Cloud,
  HelpCircle,
  Megaphone,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

import BlogPage from "../blogbuilder/BlogPage";
import MediaLibraryModal from "./MediaLibraryModal";
import FormSubmissionsModal from "./FormSubmissionsModal";


type ViewKey = "menu" | "blog" | "media" | "formSubmissions";

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  view?: ViewKey;
  trailing?: React.ReactNode;
};

type Group = {
  items: Item[];
};

const groups: Group[] = [
  {
    items: [
      { label: "Blog", icon: <PencilLine className="h-4 w-4" />, view: "blog" },
      { label: "Appointments", icon: <CalendarDays className="h-4 w-4" />, href: "#" },
    ],
  },
  {
    items: [
      { label: "General settings", icon: <Globe2 className="h-4 w-4" />, href: "#" },
      { label: "Integrations", icon: <Grip className="h-4 w-4" />, href: "#" },
      { label: "Form submissions", icon: <FileText className="h-4 w-4" />, view: "formSubmissions" }, // ✅ open modal
      { label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, href: "#" },
    ],
  },
  {
    items: [
      { label: "Media library", icon: <ImageIcon className="h-4 w-4" />, view: "media" },
      { label: "Multi-language", icon: <Languages className="h-4 w-4" />, href: "#" },
      { label: "Manage backups", icon: <Cloud className="h-4 w-4" />, href: "#" },
      { label: "Export content to WordPress", icon: <Cloud className="h-4 w-4" />, href: "#" },
    ],
  },
  {
    items: [
      { label: "Help & Resources", icon: <HelpCircle className="h-4 w-4" />, href: "#" },
      {
        label: "What's new?",
        icon: <Megaphone className="h-4 w-4" />,
        href: "#",
        trailing: <ExternalLink className="h-4 w-4 opacity-70" />,
      },
    ],
  },
];

function Row({
  item,
  onOpenView,
}: {
  item: Item;
  onOpenView: (view: ViewKey) => void;
}) {
  if (item.view) {
    return (
      <button
        type="button"
        onClick={() => onOpenView(item.view!)}
        className="group flex w-full items-center justify-between rounded-sm px-2 py-1 text-left transition hover:bg-slate-200 "
      >
        <div className="flex items-center gap-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl ">
            {item.icon}
          </span>
          <span className="text-base font-normal ">{item.label}</span>
        </div>

        {item.trailing ? <span className="text-slate-500">{item.trailing}</span> : null}
      </button>
    );
  }

  return (
    <a
      href={item.href ?? "#"}
      className="group flex items-center justify-between rounded-sm px-2 py-1 transition hover:bg-slate-200"
    >
      <div className="flex items-center gap-1">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl ">
          {item.icon}
        </span>
        <span className="text-base font-normal ">{item.label}</span>
      </div>

      {item.trailing ? <span className="text-slate-500">{item.trailing}</span> : null}
    </a>
  );
}

const Divider = () => <div className="my-3 h-px w-full bg-slate-200" />;

export default function AllBuilderPage() {
  const [view, setView] = React.useState<ViewKey>("menu");

  // ✅ Media Library
  if (view === "media") {
    return (
      <div className="min-h-screen w-full bg-white">
        <MediaLibraryModal onClose={() => setView("menu")} />
      </div>
    );
  }

  // ✅ Form Submissions
  if (view === "formSubmissions") {
    return (
      <div className="min-h-screen w-full bg-white">
        <FormSubmissionsModal onClose={() => setView("menu")} />
      </div>
    );
  }

  // ✅ Blog
  if (view === "blog") {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 pb-2 pt-1">
          <div className="text-sm font-semibold text-slate-900">Blog</div>

          <button
            type="button"
            onClick={() => setView("menu")}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div>
          <BlogPage />
        </div>
      </div>
    );
  }

  // ✅ Menu view
  return (
    <div className="min-h-screen w-[290px] ">
      <div className="w-full px-0 py-0">
        <div className="rounded-2xl ">
          {groups.map((g, idx) => (
            <div key={idx}>
              {g.items.map((item) => (
                <Row key={item.label} item={item} onOpenView={setView} />
              ))}
              {idx !== groups.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
