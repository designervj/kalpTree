"use client";

import * as React from "react";
import {
  X,
  Upload,
  FolderPlus,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Type,
  Folder,
  ChevronRight,
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

type MediaTab = "my" | "images" | "ai" | "docs";

export type MediaItem = {
  id: string;
  folderId: string; // ✅ which folder this item belongs to
  name: string;
  ext: "PNG" | "JPG" | "PDF" | "DOC";
  kind: "image" | "doc";
  src: string; // image preview url (empty for docs)
};

type FolderNode = {
  id: string;
  name: string;
  parentId: string | null; // null = root
};

const ROOT_FOLDER_ID = "root";

const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: "1",
    folderId: ROOT_FOLDER_ID,
    name: "pp",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/3766181/pexels-photo-3766181.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "2",
    folderId: ROOT_FOLDER_ID,
    name: "pp",
    ext: "PNG",
    kind: "image",
    src: "https://images.pexels.com/photos/5945875/pexels-photo-5945875.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "3",
    folderId: ROOT_FOLDER_ID,
    name: "photo-157419513",
    ext: "JPG",
    kind: "image",
    src: "https://images.pexels.com/photos/2832034/pexels-photo-2832034.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

function safeId() {
  // crypto.randomUUID can fail in some environments
  // so fallback to time+random
  // @ts-ignore
  return (globalThis.crypto?.randomUUID?.() as string) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function buildBreadcrumb(folders: FolderNode[], activeId: string) {
  if (activeId === ROOT_FOLDER_ID) return [{ id: ROOT_FOLDER_ID, name: "My library" }];

  const map = new Map(folders.map((f) => [f.id, f]));
  const chain: Array<{ id: string; name: string }> = [{ id: ROOT_FOLDER_ID, name: "My library" }];

  let cur: FolderNode | undefined = map.get(activeId);
  const guard = new Set<string>();

  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    chain.push({ id: cur.id, name: cur.name });
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }

  return chain;
}

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
    <div className="rounded-lg ">
      <div className="flex items-center justify-between gap-3 py-2 px-2 border border-gray-200 rounded-md">
        <button
          type="button"
          onClick={onOpen}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left hover:opacity-80"
          aria-label={`Open folder ${name}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Folder className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-slate-900">{name}</div>
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Folder actions"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
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

  // ✅ Folder system (breadcrumb + folder cards like screenshot)
  const [folders, setFolders] = React.useState<FolderNode[]>([
    { id: "f1", name: "New folder", parentId: ROOT_FOLDER_ID },
  ]);
  const [activeFolderId, setActiveFolderId] = React.useState<string>(ROOT_FOLDER_ID);

  // ✅ Create folder dialog
  const [createOpen, setCreateOpen] = React.useState(false);
  const [folderName, setFolderName] = React.useState("");

  // ✅ Rename folder dialog
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameFolderId, setRenameFolderId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (itemsProp) setItems(itemsProp);
  }, [itemsProp]);

  const subfolders = React.useMemo(() => {
    return folders.filter((f) => f.parentId === activeFolderId);
  }, [folders, activeFolderId]);

  const visibleItems = React.useMemo(() => {
    const inFolder = items.filter((x) => x.folderId === activeFolderId);

    if (tab === "docs") return inFolder.filter((x) => x.kind === "doc");
    // In “images/my/ai” we show images only (same as your original behavior)
    return inFolder.filter((x) => x.kind === "image");
  }, [items, tab, activeFolderId]);

  const breadcrumb = React.useMemo(() => buildBreadcrumb(folders, activeFolderId), [folders, activeFolderId]);

  if (!open) return null;

  // ✅ robust file picker
  const openPicker = async () => {
    const input = fileRef.current;
    if (!input) return;

    // allow re-uploading same file again
    input.value = "";

    try {
      // @ts-ignore - showPicker exists in Chromium
      if (typeof input.showPicker === "function") {
        // @ts-ignore
        input.showPicker();
        return;
      }
    } catch {
      // ignore and fallback to click
    }

    input.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const next: MediaItem[] = [];
    let addedAnyImage = false;
    let addedAnyDoc = false;

    Array.from(files).forEach((f) => {
      const isImage = f.type.startsWith("image/");
      const rawExt = (f.name.split(".").pop() || "").toUpperCase();

      const ext = (["PNG", "JPG", "PDF", "DOC"] as const).includes(rawExt as any)
        ? (rawExt as MediaItem["ext"])
        : isImage
          ? "PNG"
          : "PDF";

      if (isImage) addedAnyImage = true;
      else addedAnyDoc = true;

      next.push({
        id: safeId(),
        folderId: activeFolderId, // ✅ upload into current folder
        name: f.name.replace(/\.[^/.]+$/, ""),
        ext,
        kind: isImage ? "image" : "doc",
        src: isImage ? URL.createObjectURL(f) : "",
      });
    });

    setItems((p) => [...next, ...p]);

    // ✅ If user is in Docs but uploads images, switch to My library so they see it.
    if (tab === "docs" && addedAnyImage && !addedAnyDoc) setTab("my");
    if (tab !== "docs" && addedAnyDoc && !addedAnyImage) setTab("docs");
  };

  const createFolder = () => {
    const name = folderName.trim();
    if (!name) return;

    const newFolder: FolderNode = { id: safeId(), name, parentId: activeFolderId };
    setFolders((p) => [...p, newFolder]);
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

    setFolders((p) => p.map((f) => (f.id === renameFolderId ? { ...f, name } : f)));
    setRenameOpen(false);
    setRenameFolderId(null);
    setRenameValue("");
  };

  const deleteFolder = (folderId: string) => {
    // ✅ simple delete: remove folder + subfolders + items inside them
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="relative h-[86vh] w-[96vw] max-w-[1400px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-10 pt-4">
          <h2 className="text-[24px] font-semibold text-slate-900">Media library </h2>
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
            <Button type="button" variant="outline" onClick={() => setCreateOpen(true)}>
              <FolderPlus className="mr-2 h-5 w-5" />
              Create folder
            </Button>

            <Button type="button" onClick={openPicker}>
              <Upload className="mr-2 h-5 w-5" />
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
        <div className="mt-3 flex h-[calc(86vh-160px)] flex-col px-10 pb-8">
          {/* ✅ Breadcrumb like screenshot: "My library > New folder" */}
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
            {breadcrumb.map((b, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              const clickable = b.id === ROOT_FOLDER_ID && activeFolderId !== ROOT_FOLDER_ID;

              return (
                <React.Fragment key={b.id}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => setActiveFolderId(ROOT_FOLDER_ID)}
                    className={cx(
                      "rounded-md px-1 py-0.5",
                      clickable ? "text-slate-700 hover:bg-slate-100" : "text-slate-600",
                      isLast ? "font-semibold text-slate-900" : ""
                    )}
                    aria-label={clickable ? "Go to My library" : undefined}
                  >
                    {b.name}
                  </button>

                  {!isLast ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto pr-3">
            <div className="grid grid-cols-6 gap-2">
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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-4">
              {/* ✅ Folder cards first (design like your screenshot tile) */}


              {/* Media items */}
              {visibleItems.map((it) => (
                <div key={it.id} className="rounded-lg border border-slate-200 bg-white ">
                  <div className="p-3">
                    <CheckerWrap>
                      {it.kind === "image" ? (
                        <img src={it.src} alt={it.name} className="h-full w-full object-contain" />
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
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            console.log("Rename item", it.id);
                          }}
                        >
                          <Type className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            console.log("Edit item", it.id);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onSelect={(e) => {
                            e.preventDefault();
                            console.log("Delete item", it.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {subfolders.length === 0 && visibleItems.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                  No items in this folder.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ✅ Create Folder Dialog */}
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

        {/* ✅ Rename Folder Dialog */}
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
      </div>
    </div>
  );
}
