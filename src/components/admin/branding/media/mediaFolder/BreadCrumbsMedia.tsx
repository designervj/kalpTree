import { ChevronRight } from 'lucide-react';
import React from 'react'


type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
};

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}
const ROOT_FOLDER_ID = "root";
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
const BreadCrumbsMedia = () => {
      const [activeFolderId, setActiveFolderId] =
        React.useState<string>(ROOT_FOLDER_ID);
      const [folders, setFolders] = React.useState<FolderNode[]>([
        { id: "f1", name: "New folder", parentId: ROOT_FOLDER_ID },
      ]);
      const breadcrumb = React.useMemo(
        () => buildBreadcrumb(folders, activeFolderId),
        [folders, activeFolderId]
      );
  return (
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
  )
}

export default BreadCrumbsMedia