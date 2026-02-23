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
    src: "https://picsum.photos/seed/portrait/600/400",
  },
  {
    id: "2",
    folderId: ROOT_FOLDER_ID,
    name: "fruits-basket",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/fruits/600/400",
  },
  {
    id: "3",
    folderId: ROOT_FOLDER_ID,
    name: "mountain-cabin",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/mountain/600/400",
  },
  {
    id: "4",
    folderId: ROOT_FOLDER_ID,
    name: "city-skyline",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/city/600/400",
  },
  {
    id: "5",
    folderId: ROOT_FOLDER_ID,
    name: "coffee-shop",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/coffee/600/400",
  },
  {
    id: "6",
    folderId: ROOT_FOLDER_ID,
    name: "ocean-sunset",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/ocean/600/400",
  },
  {
    id: "7",
    folderId: ROOT_FOLDER_ID,
    name: "workspace-desk",
    ext: "PNG",
    kind: "image",
    src: "https://picsum.photos/seed/desk/600/400",
  },
  {
    id: "8",
    folderId: ROOT_FOLDER_ID,
    name: "flower-garden",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/flowers/600/400",
  },
  {
    id: "9",
    folderId: ROOT_FOLDER_ID,
    name: "travel-map",
    ext: "JPG",
    kind: "image",
    src: "https://picsum.photos/seed/travel/600/400",
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
        "relative px-0 py-4 text-sm font-semibold transition whitespace-nowrap",
        active ? "text-violet-600" : "text-slate-500 hover:text-slate-800"
      )}
    >
      {children}
      {active && (
        <span className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-violet-600" />
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
            className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
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
}: {
  item: MediaItem;
  onDelete: () => void;
  onRename: () => void;
}) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Image preview area with checkered bg */}
      <div
        className="relative w-full"
        style={{
          paddingBottom: "72%", // ~4:3 aspect ratio
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

      {/* Info row inside the card */}
      <div className="flex items-start justify-between gap-1 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-slate-900">
            {item.name}
          </p>
          <p className="text-xs font-medium text-violet-600">{item.ext}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 mt-0.5"
              aria-label="More"
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
   Main page
───────────────────────────────────────────── */
export default function MediaPage() {
  const [tab, setTab] = React.useState<MediaTab>("my");
  const [items, setItems] = React.useState<MediaItem[]>(DEFAULT_ITEMS);
  const [folders, setFolders] = React.useState<FolderNode[]>([
    { id: "f1", name: "New folder", parentId: ROOT_FOLDER_ID },
  ]);
  const [activeFolderId, setActiveFolderId] =
    React.useState<string>(ROOT_FOLDER_ID);

  // Create folder dialog
  const [createOpen, setCreateOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");

  // Rename folder dialog
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameFolderId, setRenameFolderId] = React.useState<string | null>(
    null
  );
  const [renameValue, setRenameValue] = React.useState("");

  // Rename item dialog
  const [renameItemOpen, setRenameItemOpen] = React.useState(false);
  const [renameItemId, setRenameItemId] = React.useState<string | null>(null);
  const [renameItemValue, setRenameItemValue] = React.useState("");

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const subfolders = React.useMemo(
    () => folders.filter((f) => f.parentId === activeFolderId),
    [folders, activeFolderId]
  );

  const visibleItems = React.useMemo(() => {
    const inFolder = items.filter((x) => x.folderId === activeFolderId);
    if (tab === "docs") return inFolder.filter((x) => x.kind === "doc");
    return inFolder.filter((x) => x.kind === "image");
  }, [items, tab, activeFolderId]);

  const breadcrumb = React.useMemo(
    () => buildBreadcrumb(folders, activeFolderId),
    [folders, activeFolderId]
  );

  /* ── File picker ── */
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
    } catch {
      // fallback
    }
    input.click();
  };

  const handleFiles = (files: FileList | null) => {
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
        kind: isImage ? "image" : "doc",
        src: isImage ? URL.createObjectURL(f) : "",
      });
    });

    setItems((p) => [...next, ...p]);

    if (tab === "docs" && addedImage && !addedDoc) setTab("my");
    if (tab !== "docs" && addedDoc && !addedImage) setTab("docs");
  };

  /* ── Folder CRUD ── */
  const createFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    setFolders((p) => [
      ...p,
      { id: safeId(), name, parentId: activeFolderId },
    ]);
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

  /* ── Item CRUD ── */
  const deleteItem = (id: string) => {
    setItems((p) => p.filter((x) => x.id !== id));
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
    setItems((p) =>
      p.map((x) => (x.id === renameItemId ? { ...x, name } : x))
    );
    setRenameItemOpen(false);
    setRenameItemId(null);
    setRenameItemValue("");
  };

  /* ─────────────────────────────────
     Render
  ───────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Title ── */}
      <div className="px-8 pt-5 pb-1 bg-white">
        <h1 className="text-xl font-semibold text-slate-900">Media library</h1>
      </div>

      {/* ── Tabs + Actions in one row ── */}
      <div className="flex items-center justify-between px-8 bg-white border-b border-slate-200">
        {/* Tabs */}
        <div className="flex items-center gap-8">
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

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Create folder
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={openPicker}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
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

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-8 py-5">

        {/* Breadcrumb */}
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
                {!isLast && (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Folders */}
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

        {/* Media grid */}
        {visibleItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {visibleItems.map((it) => (
              <MediaCard
                key={it.id}
                item={it}
                onDelete={() => deleteItem(it.id)}
                onRename={() => openRenameItem(it.id)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {subfolders.length === 0 && visibleItems.length === 0 && (
          <div className="mt-16 text-center text-gray-400">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">
              No files here. Upload or create a folder to get started.
            </p>
          </div>
        )}
      </div>

      {/* ── Create Folder Dialog ── */}
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

      {/* ── Rename Folder Dialog ── */}
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

      {/* ── Rename Item Dialog ── */}
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
  );
}
