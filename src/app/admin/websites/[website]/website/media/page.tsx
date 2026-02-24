"use client";

import * as React from "react";
import {
  Upload,
  FolderPlus,
  FileText,
  Trash2,
  Type,
  Folder,
  ChevronRight,
  MoreVertical,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Download,
  ExternalLink,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type MediaTab = "my" | "images" | "ai" | "docs";

type MediaItem = {
  id: string;
  folderId: string;
  name: string;
  ext: "PNG" | "JPG" | "PDF" | "DOC";
  kind: "image" | "doc";
  src: string;
  sizeKb?: number;
  uploadedOn?: string;
  uploadedBy?: string;
  mimeType?: string;
};

type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
};

const ROOT_FOLDER_ID = "root";

const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: "1",
    folderId: ROOT_FOLDER_ID,
    name: "portrait-woman",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/portrait/1200/800",
    sizeKb: 124,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "2",
    folderId: ROOT_FOLDER_ID,
    name: "fruits-basket",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/fruits/1200/800",
    sizeKb: 98,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "3",
    folderId: ROOT_FOLDER_ID,
    name: "mountain-cabin",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/mountain/1200/800",
    sizeKb: 177,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "4",
    folderId: ROOT_FOLDER_ID,
    name: "city-skyline",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/city/1200/800",
    sizeKb: 141,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "5",
    folderId: ROOT_FOLDER_ID,
    name: "coffee-shop",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/coffee/1200/800",
    sizeKb: 109,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "6",
    folderId: ROOT_FOLDER_ID,
    name: "ocean-sunset",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/ocean/1200/800",
    sizeKb: 132,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "7",
    folderId: ROOT_FOLDER_ID,
    name: "workspace-desk",
    ext: "PNG",
    kind: "image",
    src: "https://picsum.photos/seed/desk/1200/800",
    sizeKb: 204,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/png",
  },
  {
    id: "8",
    folderId: ROOT_FOLDER_ID,
    name: "flower-garden",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/flowers/1200/800",
    sizeKb: 156,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
  {
    id: "9",
    folderId: ROOT_FOLDER_ID,
    name: "travel-map",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/travel/1200/800",
    sizeKb: 87,
    uploadedOn: "Aug 26, 2025",
    uploadedBy: "admin",
    mimeType: "image/jpeg",
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

function safeId() {
  return (
    // @ts-ignore
    (globalThis.crypto?.randomUUID?.() as string) ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function buildBreadcrumb(folders: FolderNode[], activeId: string) {
  if (activeId === ROOT_FOLDER_ID)
    return [{ id: ROOT_FOLDER_ID, name: "My library" }];

  const map = new Map(folders.map((f) => [f.id, f]));
  const chain: Array<{ id: string; name: string }> = [
    { id: ROOT_FOLDER_ID, name: "My library" },
  ];

  let cur: FolderNode | undefined = map.get(activeId);
  const guard = new Set<string>();

  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    chain.push({ id: cur.id, name: cur.name });
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }

  return chain;
}

function fakeWpUrl(name: string, ext: string) {
  return `https://codifiedweb.com/wp-content/uploads/${name}.${ext.toLowerCase()}`;
}

function getKindFromFile(file: File): "image" | "doc" {
  return file.type.startsWith("image/") ? "image" : "doc";
}

/* ─────────────────────────────────────────────
   Tab button
───────────────────────────────────────────── */
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
        "relative -mb-px px-0 py-4 text-sm font-semibold transition",
        active ? "text-violet-600" : "text-slate-500 hover:text-slate-800"
      )}
    >
      {children}
      {active && (
        <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full bg-violet-600" />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Folder card
───────────────────────────────────────────── */
function FolderCard({
  name,
  onOpen,
  onRename,
  onDelete,
}: {
  name: string;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-2 border border-gray-200 p-3 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition group"
    >
      <Folder size={20} className="text-slate-500 shrink-0" />
      <span className="text-sm font-medium text-slate-800 truncate flex-1">
        {name}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer opacity-0 group-hover:opacity-100 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Folder actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onRename();
            }}
          >
            <Type className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Media item card
───────────────────────────────────────────── */
function MediaCard({
  item,
  onDelete,
  onRename,
  onOpenDetails,
}: {
  item: MediaItem;
  onDelete: () => void;
  onRename: () => void;
  onOpenDetails: () => void;
}) {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <button
        type="button"
        onClick={onOpenDetails}
        className="block w-full text-left"
      >
        <div
          className="relative w-full"
          style={{
            paddingBottom: "72%",
            background:
              "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px",
          }}
        >
          {item.kind === "image" ? (
            <img
              src={item.src}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="text-gray-400" size={40} />
            </div>
          )}
        </div>
      </button>

      <div className="flex items-start justify-between gap-1 px-3 py-2.5">
        <button
          type="button"
          onClick={onOpenDetails}
          className="min-w-0 text-left flex-1"
        >
          <p className="text-sm font-semibold truncate text-slate-900 hover:text-violet-600">
            {item.name}
          </p>
          <p className="text-xs font-medium text-violet-600">{item.ext}</p>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 mt-0.5"
              aria-label="More"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onOpenDetails();
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Attachment details
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onRename();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Attachment Details Modal (WP-style)
───────────────────────────────────────────── */
function AttachmentDetailsModal({
  open,
  items,
  selectedId,
  onOpenChange,
  onNavigate,
  onSaveMeta,
  onDelete,
  onRenameQuick,
}: {
  open: boolean;
  items: MediaItem[];
  selectedId: string | null;
  onOpenChange: (v: boolean) => void;
  onNavigate: (id: string) => void;
  onSaveMeta: (
    id: string,
    data: {
      title: string;
      alt: string;
      caption: string;
      description: string;
      attachmentCategory: string;
      linkUrl: string;
      linkTarget: string;
      downloadAsFile: boolean;
      excludeFromSitemap: boolean;
    }
  ) => void;
  onDelete: (id: string) => void;
  onRenameQuick: (id: string, newName: string) => void;
}) {
  const index = React.useMemo(
    () => items.findIndex((x) => x.id === selectedId),
    [items, selectedId]
  );
  const item = index >= 0 ? items[index] : null;

  const [title, setTitle] = React.useState("");
  const [alt, setAlt] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [attachmentCategory, setAttachmentCategory] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkTarget, setLinkTarget] = React.useState("In The Same Window");
  const [downloadAsFile, setDownloadAsFile] = React.useState(false);
  const [excludeFromSitemap, setExcludeFromSitemap] = React.useState(false);

  const metaStore = React.useRef<
    Record<
      string,
      {
        title: string;
        alt: string;
        caption: string;
        description: string;
        attachmentCategory: string;
        linkUrl: string;
        linkTarget: string;
        downloadAsFile: boolean;
        excludeFromSitemap: boolean;
      }
    >
  >({});

  React.useEffect(() => {
    if (!item) return;
    const existing = metaStore.current[item.id];
    const defaultTitle = item.name;

    if (existing) {
      setTitle(existing.title);
      setAlt(existing.alt);
      setCaption(existing.caption);
      setDescription(existing.description);
      setAttachmentCategory(existing.attachmentCategory);
      setLinkUrl(existing.linkUrl);
      setLinkTarget(existing.linkTarget);
      setDownloadAsFile(existing.downloadAsFile);
      setExcludeFromSitemap(existing.excludeFromSitemap);
    } else {
      setTitle(defaultTitle);
      setAlt("");
      setCaption("");
      setDescription("");
      setAttachmentCategory("");
      setLinkUrl("");
      setLinkTarget("In The Same Window");
      setDownloadAsFile(false);
      setExcludeFromSitemap(false);
    }
  }, [item]);

  const persistCurrent = React.useCallback(() => {
    if (!item) return;
    const payload = {
      title,
      alt,
      caption,
      description,
      attachmentCategory,
      linkUrl,
      linkTarget,
      downloadAsFile,
      excludeFromSitemap,
    };
    metaStore.current[item.id] = payload;
    onSaveMeta(item.id, payload);
  }, [
    item,
    title,
    alt,
    caption,
    description,
    attachmentCategory,
    linkUrl,
    linkTarget,
    downloadAsFile,
    excludeFromSitemap,
    onSaveMeta,
  ]);

  const canPrev = index > 0;
  const canNext = index >= 0 && index < items.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    persistCurrent();
    onNavigate(items[index - 1].id);
  };

  const goNext = () => {
    if (!canNext) return;
    persistCurrent();
    onNavigate(items[index + 1].id);
  };

  const onClose = () => {
    persistCurrent();
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line

  if (!open || !item) return null;

  const fileUrl = fakeWpUrl(item.name, item.ext);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/55">
      <div className="absolute inset-4 bg-white rounded-xl shadow-2xl overflow-hidden border border-black/10 ">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <h2 className="text-[18px] font-semibold text-slate-800">
            Attachment details
          </h2>

          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className=" cursor-pointer h-14 w-14 grid place-items-center border-none border-gray-200 text-slate-600 hover:bg-slate-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_620px] h-[calc(100%-56px)]">
          {/* Left preview */}
          <div className="bg-[#f6f7f7] p-6 overflow-auto">
            <div className="mx-auto max-w-5xl">
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="relative w-full bg-white flex items-center ">
                   <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              className={cx(
                " grid place-items-center border border-gray-200 rounded-full shadow-sm p-4 bg-gray-100 cursor-pointer",
                canPrev
                  ? "text-slate-600 hover:bg-slate-50"
                  : "text-slate-300 cursor-not-allowed"
              )}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          

                  {item.kind === "image" ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-[600px] h-[550px] object-contain mx-auto"
                    />
                  ) : (
                    <div className="h-[420px] flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded">
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="mt-2 text-sm text-slate-500">
                          Document preview not available
                        </p>
                      </div>
                    </div>
                  )}


  <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              className={cx(
                "grid place-items-center  border border-gray-200 rounded-full shadow-sm p-4 bg-gray-100 cursor-pointer z-9 relative",
                canNext
                  ? "text-slate-600 hover:bg-slate-50"
                  : "text-slate-300 cursor-not-allowed"
              )}
              aria-label="Next"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

                </div>
              </div>
            </div>
          </div>

          {/* Right details panel */}
          <div className="bg-[#f6f7f7] border-l border-gray-200 h-full overflow-y-auto">
            <div className="p-5 space-y-5">
              {/* ✅ Redesigned top info card (matches first image style) */}
              <div className="rounded-2xl border border-[#d7dbe1] bg-white px-4 py-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  {/* Header */}
  <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
    <div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200 bg-violet-50">
      <Shield className="h-4 w-4 text-violet-700" />
    </div>

    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-slate-900">
        Attachment Information
      </h3>
      <p className="text-xs text-slate-500">
        File metadata and upload details
      </p>
    </div>
  </div>

  {/* Details */}
  <div className="space-y-2">
    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-xs font-medium text-slate-500">Uploaded on</span>
      <span className="text-sm text-slate-800">
        {item.uploadedOn || "Aug 26, 2025"}
      </span>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">Uploaded by</span>
      <button
        className="w-fit text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        type="button"
      >
        {item.uploadedBy || "admin"}
      </button>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">Uploaded to</span>
      <button
        className="w-fit text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        type="button"
      >
        Sample Post
      </button>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">File name</span>
      <span className="break-all text-sm text-slate-800">
        {item.name}.{item.ext.toLowerCase()}
      </span>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">File type</span>
      <span className="text-sm text-slate-800">
        {item.mimeType ||
          (item.kind === "image" ? "image/jpeg" : "application/pdf")}
      </span>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">File size</span>
      <span className="text-sm text-slate-800">{item.sizeKb || 100} KB</span>
    </div>

    <div className="grid grid-cols-[120px_1fr] items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="text-xs font-medium text-slate-500">Dimensions</span>
      <span className="text-sm text-slate-800">768 × 432 px</span>
    </div>
  </div>



</div>

              </div>

              <hr className="border-gray-200" />

              {/* Form rows */}
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-[150px_1fr] items-start gap-3">
                  <label className="pt-2 text-slate-600">Alternative Text</label>
                  <div>
                    <Input
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      className="bg-white"
                    />
                    <div className="mt-2">
                      <Button type="button" variant="outline" size="sm">
                        ✨ Generate Alt
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-5">
                      Leave empty if the image is purely decorative.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <label className="text-slate-600">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-start gap-3">
                  <label className="pt-2 text-slate-600">Caption</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-start gap-3">
                  <label className="pt-2 text-slate-600">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <label className="text-slate-600">File URL:</label>
                  <Input value={fileUrl} readOnly className="bg-white" />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-3">
                  <div />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => navigator.clipboard?.writeText(fileUrl)}
                  >
                    Copy URL to clipboard
                  </Button>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Bottom actions */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <button
                  type="button"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View attachment page
                </button>

                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    const nextName = window.prompt("Rename file", title);
                    if (!nextName?.trim()) return;
                    setTitle(nextName.trim());
                    onRenameQuick(item.id, nextName.trim());
                  }}
                >
                  Edit more details
                </button>

                <button
                  type="button"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download file
                </button>

                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    const yes = window.confirm("Delete this file permanently?");
                    if (!yes) return;
                    onDelete(item.id);
                    const remaining = items.filter((x) => x.id !== item.id);
                    if (remaining.length) {
                      onNavigate(
                        remaining[Math.min(index, remaining.length - 1)].id
                      );
                    } else {
                      onOpenChange(false);
                    }
                  }}
                >
                  Delete permanently
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="button"
                  onClick={() => {
                    persistCurrent();
                    onOpenChange(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function Page() {
  const [tab, setTab] = React.useState<MediaTab>("my");
  const [items, setItems] = React.useState<MediaItem[]>(DEFAULT_ITEMS);
  const [folders, setFolders] = React.useState<FolderNode[]>([
    { id: "f1", name: "New folder", parentId: ROOT_FOLDER_ID },
  ]);
  const [activeFolderId, setActiveFolderId] =
    React.useState<string>(ROOT_FOLDER_ID);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");

  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameFolderId, setRenameFolderId] = React.useState<string | null>(
    null
  );
  const [renameValue, setRenameValue] = React.useState("");

  const [renameItemOpen, setRenameItemOpen] = React.useState(false);
  const [renameItemId, setRenameItemId] = React.useState<string | null>(null);
  const [renameItemValue, setRenameItemValue] = React.useState("");

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = React.useState<
    string | null
  >(null);

  const [attachmentMeta, setAttachmentMeta] = React.useState<
    Record<
      string,
      {
        title?: string;
        alt?: string;
        caption?: string;
        description?: string;
        attachmentCategory?: string;
        linkUrl?: string;
        linkTarget?: string;
        downloadAsFile?: boolean;
        excludeFromSitemap?: boolean;
      }
    >
  >({});

  const [isDragging, setIsDragging] = React.useState(false);
  const dragDepthRef = React.useRef(0);

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const subfolders = React.useMemo(
    () => folders.filter((f) => f.parentId === activeFolderId),
    [folders, activeFolderId]
  );

  const visibleItems = React.useMemo(() => {
    const inFolder = items.filter((x) => x.folderId === activeFolderId);

    if (tab === "docs") return inFolder.filter((x) => x.kind === "doc");
    if (tab === "images") return inFolder.filter((x) => x.kind === "image");
    if (tab === "ai") return inFolder.filter((x) => x.kind === "image");
    return inFolder;
  }, [items, tab, activeFolderId]);

  const breadcrumb = React.useMemo(
    () => buildBreadcrumb(folders, activeFolderId),
    [folders, activeFolderId]
  );

  const visibleItemsForDetails = React.useMemo(() => {
    return visibleItems;
  }, [visibleItems]);

  const openPicker = () => {
    const input = fileRef.current;
    if (!input) return;
    input.value = "";
    try {
      // @ts-ignore
      if (typeof input.showPicker === "function") {
        // @ts-ignore
        input.showPicker();
        return;
      }
    } catch {}
    input.click();
  };

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;

      const next: MediaItem[] = [];
      let addedImage = false;
      let addedDoc = false;

      Array.from(files).forEach((f) => {
        const isImage = f.type.startsWith("image/");
        const rawExt = (f.name.split(".").pop() || "").toUpperCase();
        const ext = (["PNG", "JPG", "PDF", "DOC"] as const).includes(
          rawExt as any
        )
          ? (rawExt as MediaItem["ext"])
          : isImage
          ? "PNG"
          : "PDF";

        if (isImage) addedImage = true;
        else addedDoc = true;

        next.push({
          id: safeId(),
          folderId: activeFolderId,
          name: f.name.replace(/\.[^/.]+$/, ""),
          ext,
          kind: getKindFromFile(f),
          src: isImage ? URL.createObjectURL(f) : "",
          sizeKb: Math.max(1, Math.round(f.size / 1024)),
          uploadedOn: new Date().toLocaleDateString(),
          uploadedBy: "admin",
          mimeType:
            f.type || (isImage ? "image/jpeg" : "application/octet-stream"),
        });
      });

      setItems((p) => [...next, ...p]);

      if (tab === "docs" && addedImage && !addedDoc) setTab("my");
      if (tab !== "docs" && addedDoc && !addedImage) setTab("docs");
    },
    [activeFolderId, tab]
  );

  const hasFilesInDrag = (e: React.DragEvent) => {
    return Array.from(e.dataTransfer.types || []).includes("Files");
  };

  const onDragEnter = (e: React.DragEvent) => {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    if (!hasFilesInDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const createFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    setFolders((p) => [...p, { id: safeId(), name, parentId: activeFolderId }]);
    setFolderName("");
    setCreateOpen(false);
  };

  const openRenameFolder = (folderId: string) => {
    const f = folders.find((x) => x.id === folderId);
    if (!f) return;
    setRenameFolderId(folderId);
    setRenameValue(f.name);
    setRenameOpen(true);
  };

  const renameFolder = () => {
    if (!renameFolderId) return;
    const name = renameValue.trim();
    if (!name) return;
    setFolders((p) =>
      p.map((f) => (f.id === renameFolderId ? { ...f, name } : f))
    );
    setRenameOpen(false);
    setRenameFolderId(null);
    setRenameValue("");
  };

  const deleteFolder = (folderId: string) => {
    const toDelete = new Set<string>();
    const queue = [folderId];
    while (queue.length) {
      const id = queue.pop()!;
      if (toDelete.has(id)) continue;
      toDelete.add(id);
      folders.forEach((f) => {
        if (f.parentId === id) queue.push(f.id);
      });
    }
    setFolders((p) => p.filter((f) => !toDelete.has(f.id)));
    setItems((p) => p.filter((it) => !toDelete.has(it.folderId)));
    if (toDelete.has(activeFolderId)) setActiveFolderId(ROOT_FOLDER_ID);
  };

  const deleteItem = (id: string) => {
    setItems((p) => p.filter((x) => x.id !== id));
    setAttachmentMeta((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
    if (selectedAttachmentId === id) {
      setDetailsOpen(false);
      setSelectedAttachmentId(null);
    }
  };

  const openRenameItem = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setRenameItemId(id);
    setRenameItemValue(it.name);
    setRenameItemOpen(true);
  };

  const saveRenameItem = () => {
    if (!renameItemId) return;
    const name = renameItemValue.trim();
    if (!name) return;
    setItems((p) => p.map((x) => (x.id === renameItemId ? { ...x, name } : x)));
    setRenameItemOpen(false);
    setRenameItemId(null);
    setRenameItemValue("");

    setAttachmentMeta((p) => ({
      ...p,
      [renameItemId]: {
        ...p[renameItemId],
        title: p[renameItemId]?.title || name,
      },
    }));
  };

  const openAttachmentDetails = (id: string) => {
    setSelectedAttachmentId(id);
    setDetailsOpen(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 z-[9999] bg-blue-900/85">
          <div className="absolute inset-1 border-2 border-dashed border-white/70 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-20 w-20 rounded-2xl border-2 border-white/80 bg-white/10 backdrop-blur-sm grid place-items-center">
                <Upload className="h-9 w-9 text-white" />
              </div>
              <h2 className="text-white text-4xl md:text-5xl font-semibold tracking-tight">
                Drop files to upload
              </h2>
              <p className="mt-3 text-white/80 text-sm md:text-base">
                Files will be added to the current folder
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between px-8 pt-5 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage images, documents and files
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setCreateOpen(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Create Folder
          </Button>

          <Button type="button" className="cursor-pointer" onClick={openPicker}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
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

      <div className="bg-gray-50 rounded-xl max-w-6xl mx-auto space-y-8 w-full">
        <div className="flex items-center gap-8 px-8 bg-white border-b border-slate-200 py-1 rounded-sm mb-0">
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

        <div className="flex-1 overflow-y-auto px-8 py-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600">
            {breadcrumb.map((b, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              const clickable =
                b.id === ROOT_FOLDER_ID && activeFolderId !== ROOT_FOLDER_ID;

              return (
                <React.Fragment key={b.id}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => setActiveFolderId(ROOT_FOLDER_ID)}
                    className={cx(
                      "rounded px-1 py-0.5 transition",
                      clickable
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-500 cursor-default",
                      isLast ? "font-semibold text-slate-900" : ""
                    )}
                  >
                    {b.name}
                  </button>
                  {!isLast && <ChevronRight className="h-4 w-4 text-slate-400" />}
                </React.Fragment>
              );
            })}
          </div>

          {subfolders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              {subfolders.map((f) => (
                <FolderCard
                  key={f.id}
                  name={f.name}
                  onOpen={() => setActiveFolderId(f.id)}
                  onRename={() => openRenameFolder(f.id)}
                  onDelete={() => deleteFolder(f.id)}
                />
              ))}
            </div>
          )}

          {visibleItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-4">
              {visibleItems.map((it) => (
                <MediaCard
                  key={it.id}
                  item={it}
                  onDelete={() => deleteItem(it.id)}
                  onRename={() => openRenameItem(it.id)}
                  onOpenDetails={() => openAttachmentDetails(it.id)}
                />
              ))}
            </div>
          )}

          {subfolders.length === 0 && visibleItems.length === 0 && (
            <div className="mt-16 text-center text-gray-400">
              <FileText className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">
                No files here. Upload or create a folder to get started.
              </p>
            </div>
          )}
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Create folder</DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") createFolder();
                }}
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={createFolder}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Rename folder</DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Folder name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") renameFolder();
                }}
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={renameFolder}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={renameItemOpen} onOpenChange={setRenameItemOpen}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Rename file</DialogTitle>
            </DialogHeader>

            <div className="mt-2">
              <Input
                value={renameItemValue}
                onChange={(e) => setRenameItemValue(e.target.value)}
                placeholder="File name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveRenameItem();
                }}
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={saveRenameItem}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <AttachmentDetailsModal
        open={detailsOpen}
        items={visibleItemsForDetails}
        selectedId={selectedAttachmentId}
        onOpenChange={setDetailsOpen}
        onNavigate={setSelectedAttachmentId}
        onSaveMeta={(id, data) => {
          setAttachmentMeta((p) => ({ ...p, [id]: data }));
          if (data.title?.trim()) {
            setItems((prev) =>
              prev.map((it) =>
                it.id === id ? { ...it, name: data.title.trim() } : it
              )
            );
          }
        }}
        onDelete={(id) => deleteItem(id)}
        onRenameQuick={(id, newName) => {
          setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, name: newName } : it))
          );
          setAttachmentMeta((p) => ({
            ...p,
            [id]: { ...p[id], title: newName },
          }));
        }}
      />
    </div>
  );
}