import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react'
import BreadCrumbsMedia from './BreadCrumbsMedia';
import { FolderNode, MediaItem } from '../MediaType';
import MediaCard from './MediaCard';
import FolderCard from './FolderCard';

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

type MediaTab = "my" | "images" | "ai" | "docs";
const FolderTabs = () => {
  const [tab, setTab] = useState<MediaTab>("my");
  const [activeFolderId, setActiveFolderId] =
    React.useState<string>(ROOT_FOLDER_ID);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedAttachmentId, setSelectedAttachmentId] = React.useState<
    string | null
  >(null);
  const [renameItemOpen, setRenameItemOpen] = React.useState(false);
  const [renameItemId, setRenameItemId] = React.useState<string | null>(null);
  const [renameItemValue, setRenameItemValue] = React.useState("");
  const [items, setItems] = React.useState<MediaItem[]>(DEFAULT_ITEMS);
    const [folders, setFolders] = React.useState<FolderNode[]>([
      { id: "f1", name: "New folder", parentId: ROOT_FOLDER_ID },
    ]);
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
  const visibleItems = React.useMemo(() => {
    const inFolder = items.filter((x) => x.folderId === activeFolderId);

    if (tab === "docs") return inFolder.filter((x) => x.kind === "doc");
    if (tab === "images") return inFolder.filter((x) => x.kind === "image");
    if (tab === "ai") return inFolder.filter((x) => x.kind === "image");
    return inFolder;
  }, [items, tab, activeFolderId]);


  const subfolders = React.useMemo(
      () => folders.filter((f) => f.parentId === activeFolderId),
      [folders, activeFolderId]
    );

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

    const openAttachmentDetails = (id: string) => {
    setSelectedAttachmentId(id);
    setDetailsOpen(true);
  };


  const openRenameFolder = (folderId: string) => {
    const f = folders.find((x) => x.id === folderId);
    if (!f) return;
    // setRenameFolderId(folderId);
    // setRenameValue(f.name);
    // setRenameOpen(true);
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
  return (
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
        <BreadCrumbsMedia />

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
      </div>


    </div>
  )
}

export default FolderTabs