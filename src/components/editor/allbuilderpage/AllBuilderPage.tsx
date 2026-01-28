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
} from "lucide-react";

type Item = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  trailing?: React.ReactNode;
};

type Group = {
  items: Item[];
};

const groups: Group[] = [
  {
    items: [
      { label: "Blog", icon: <PencilLine className="h-5 w-5" />, href: "#" },
      {
        label: "Appointments",
        icon: <CalendarDays className="h-5 w-5" />,
        href: "#",
      },
    ],
  },
  {
    items: [
      {
        label: "General settings",
        icon: <Globe2 className="h-5 w-5" />,
        href: "#",
      },
      { label: "Integrations", icon: <Grip className="h-5 w-5" />, href: "#" },
      {
        label: "Form submissions",
        icon: <FileText className="h-5 w-5" />,
        href: "#",
      },
      { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "#" },
    ],
  },
  {
    items: [
      {
        label: "Media library",
        icon: <ImageIcon className="h-5 w-5" />,
        href: "#",
      },
      {
        label: "Multi-language",
        icon: <Languages className="h-5 w-5" />,
        href: "#",
      },
      {
        label: "Manage backups",
        icon: <Cloud className="h-5 w-5" />,
        href: "#",
      },
      {
        label: "Export content to WordPress",
        icon: <Cloud className="h-5 w-5" />,
        href: "#",
      },
    ],
  },
  {
    items: [
      {
        label: "Help & Resources",
        icon: <HelpCircle className="h-5 w-5" />,
        href: "#",
      },
      {
        label: "What's new?",
        icon: <Megaphone className="h-5 w-5" />,
        href: "#",
        trailing: <ExternalLink className="h-4 w-4 opacity-70" />,
      },
    ],
  },
];

const Row = ({ item }: { item: Item }) => {
  return (
    <a
      href={item.href ?? "#"}
      className="group flex items-center justify-between rounded-sm px-3 py-2 transition hover:bg-slate-50"
    >
      <div className="flex items-center gap-1">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-700">
          {item.icon}
        </span>
        <span className="text-base font-medium text-slate-700">
          {item.label}
        </span>
      </div>

      {item.trailing ? (
        <span className="text-slate-500">{item.trailing}</span>
      ) : null}
    </a>
  );
};

const Divider = () => <div className="my-3 h-px w-full bg-slate-200" />;

const AllBuilderPage = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Sidebar container */}
      <div className="w-full max-w-[360px] px-0 py-0">
        <div className="rounded-2xl bg-white">
          {groups.map((g, idx) => (
            <div key={idx}>
              {g.items.map((item) => (
                <Row key={item.label} item={item} />
              ))}
              {idx !== groups.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBuilderPage;
