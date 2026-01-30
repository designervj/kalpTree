"use client";

import * as React from "react";
import { X, Upload, FolderPlus,  Image as ImageIcon, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
type MediaTab = "my" | "images" | "ai" | "docs";

export type MediaItem = {
  id: string;
  name: string;
  ext: "PNG" | "JPG" | "PDF" | "DOC";
  kind: "image" | "doc";
  src: string; // image preview url
};

const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: "1",
    name: "pp",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/3766181/pexels-photo-3766181.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "2",
    name: "pp",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/5945875/pexels-photo-5945875.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "3",
    name: "photo-157419513",
    ext: "JPG",
    kind: "image",
    src: "https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "4",
    name: "pexels-cottonbro",
    ext: "JPG",
    kind: "image",
    src: "https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "5",
    name: "mm",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "6",
    name: "ll",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/4198085/pexels-photo-4198085.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "7",
    name: "kk",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/929353/pexels-photo-929353.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "8",
    name: "gg",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/3775534/pexels-photo-3775534.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "9",
    name: "dd",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/5732760/pexels-photo-5732760.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "10",
    name: "aa",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/6985197/pexels-photo-6985197.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "relative -mb-px px-0 py-3 text-base font-semibold transition",
        active ? "text-violet-600" : "text-slate-500 hover:text-slate-800"
      )}
    >
      {children}
      {active ? (
        <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full bg-violet-600" />
      ) : null}
    </button>
  );
}

function CheckerWrap({ children }: { children: React.ReactNode }) {
  // checkered background like transparent PNG preview
  return (
    <div
      className={cx(
        "h-44 w-full overflow-hidden rounded-md border border-slate-200 bg-white",
        "bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb)]",
        "bg-[length:18px_18px] bg-[position:0_0,9px_9px]"
      )}
    >
      {children}
    </div>
  );
}

export default function MediaLibraryModal({
  open = true,
  onClose,
  items: itemsProp,
}: {
  open?: boolean;
  onClose: () => void;
  items?: MediaItem[];
}) {
  const [tab, setTab] = React.useState<MediaTab>("my");
  const [items, setItems] = React.useState<MediaItem[]>(itemsProp ?? DEFAULT_ITEMS);

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (itemsProp) setItems(itemsProp);
  }, [itemsProp]);

  const visibleItems = React.useMemo(() => {
    if (tab === "docs") return items.filter((x) => x.kind === "doc");
    // For now, all non-doc tabs show images (you can wire AI images later)
    return items.filter((x) => x.kind === "image");
  }, [items, tab]);

  if (!open) return null;

  const handleUploadClick = () => fileRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const next: MediaItem[] = [];
    Array.from(files).forEach((f) => {
      const isImage = f.type.startsWith("image/");
      const ext =
        (f.name.split(".").pop() || "").toUpperCase() as MediaItem["ext"];

      next.push({
        id: crypto.randomUUID(),
        name: f.name.replace(/\.[^/.]+$/, ""),
        ext: (["PNG", "JPG", "PDF", "DOC"] as const).includes(ext as any) ? ext : "PNG",
        kind: isImage ? "image" : "doc",
        src: isImage ? URL.createObjectURL(f) : "",
      });
    });

    setItems((p) => [...next, ...p]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="relative h-[86vh] w-[96vw] max-w-[1400px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-10 pt-4">
          <h2 className="text-[24px] font-semibold text-slate-900">Media library</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs + Actions */}
        <div className="mt-2 flex items-center justify-between gap-6 px-10">
          <div className="flex items-center gap-8 border-b border-slate-200">
            <TabButton active={tab === "my"} onClick={() => setTab("my")}>
              My library
            </TabButton>
            <TabButton active={tab === "images"} onClick={() => setTab("images")}>
              Images
            </TabButton>
            <TabButton active={tab === "ai"} onClick={() => setTab("ai")}>
              AI Images
            </TabButton>
            <TabButton active={tab === "docs"} onClick={() => setTab("docs")}>
              Documents
            </TabButton>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => alert("Create folder (hook your logic here)")}
              variant="outline"
            //   className="inline-flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-violet-600 hover:bg-violet-50"
            >
                  <FolderPlus className="h-5 w-5  hover:text-primary" />
              {/* <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <FolderPlus className="h-5 w-5 text-slate-900" />
              </span> */}
              Create folder
            </Button>

            <Button
              type="button"
            
              onClick={handleUploadClick}
            //   className="inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-violet-700"
            >
              <Upload className="h-5 w-5" />
              Upload files
            </Button>

            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Body */}
        <div className="mt-3 flex h-[calc(86vh-190px)] flex-col px-10 pb-8">
          <div className="mb-4 text-md font-medium text-slate-600">
            {tab === "docs" ? "Documents" : "My library"}
          </div>

          <div className="flex-1 overflow-y-auto pr-3">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {visibleItems.map((it) => (
                <div key={it.id} className="rounded-lg border border-slate-200 bg-white">
                  <div className="p-3">
                    <CheckerWrap>
                      {it.kind === "image" ? (
                        <img
                          src={it.src}
                          alt={it.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
                            <FileText className="h-5 w-5" />
                            <span className="text-sm font-semibold">{it.ext}</span>
                          </div>
                        </div>
                      )}
                    </CheckerWrap>
                  </div>

                  <div className="flex items-end justify-between px-3 pb-3">
                    <div>
                      <div className="text-base font-medium text-slate-900">{it.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{it.ext}</div>
                    </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                        type="button"
                        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="More"
                        >
                        <MoreVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => console.log("Rename", it.id)}>
                        <Type className="mr-2 h-4 w-4" />
                        Rename
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => console.log("Edit", it.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => console.log("Delete", it.id)}
                        >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {visibleItems.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                  No items in this tab.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
