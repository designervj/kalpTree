"use client";

import * as React from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Link as LinkIcon,
  Copy,
  Settings,
  EyeOff,
  QrCode,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/** same purple like your UI */
const ACCENT = "#6D5EF5";

type PostStatus = "draft" | "scheduled" | "published";
type Visibility = "public" | "private";

type TabKey = "all" | "draft" | "scheduled" | "published";

type Post = {
  id: string;
  title: string;
  visibility: Visibility;
  date: string;
  status: PostStatus;
};

type ActionKey =
  | "edit"
  | "url"
  | "duplicate"
  | "settings"
  | "unpublish"
  | "qr"
  | "delete";

type EmptyStartBlogProps = {
  onStart: () => void;
};

type TabsBarProps = {
  tab: TabKey;
  setTab: (v: TabKey) => void;
};

type PostRowProps = {
  post: Post;
  onAction: (action: ActionKey, post: Post) => void;
};

type BlogManagerProps = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? // @ts-ignore
      crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const formatDate = (d: Date = new Date()): string => {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const EmptyStartBlog: React.FC<EmptyStartBlogProps> = ({ onStart }) => {
  const points: string[] = [
    "Create blog posts with AI",
    "Easily publish updates and articles",
    "Improve your SEO rankings",
    "Drive more traffic to your website",
    "Connect with your audience",
  ];

  return (
    <div className="flex min-h-[72vh] items-center justify-center">
      <div className="relative w-full max-w-[420px]  bg-white px-2 pb-6 pt-10 ">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-0 -top-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto w-full max-w-[340px] rounded-xl bg-slate-50 p-4">
          <div className="text-center text-xs font-semibold text-slate-700">
            Lifestyle Blog
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
            <div className="h-20 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
            <div className="h-20 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="h-2 rounded bg-slate-200" />
            <div className="h-2 rounded bg-slate-200" />
            <div className="h-2 rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <div>
            <h5 className="text-xl font-semibold">Start writing a blog</h5>
          </div>
          <div className="mt-2 text-base text-slate-500">
            Add a blog to share your stories
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {points.map((t) => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50">
                <Check className="h-4 w-4 text-blue-600" />
              </span>
              <span className="text-sm text-slate-700">{t}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onStart}
          className="mt-7 w-full rounded-xl py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Start a blog
        </button>
      </div>
    </div>
  );
};

const TabsBar: React.FC<TabsBarProps> = ({ tab, setTab }) => {
  const items: Array<{ key: TabKey; label: string }> = [
    { key: "all", label: "All" },
    { key: "draft", label: "Drafts" },
    { key: "scheduled", label: "Scheduled" },
    { key: "published", label: "Published" },
  ];

  return (
    <div className="flex items-end gap-6 border-b pb-2">
      {items.map((it) => {
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setTab(it.key)}
            className={cn(
              "relative pb-2 text-sm font-semibold",
              active
                ? "text-[var(--accent)]"
                : "text-slate-600 hover:text-slate-800"
            )}
            style={
              {
                ["--accent" as unknown as string]: ACCENT,
              } as React.CSSProperties
            }
          >
            {it.label}
            {active ? (
              <span
                className="absolute -bottom-[9px] left-0 h-[3px] w-7 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

const PostRow: React.FC<PostRowProps> = ({ post, onAction }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 hover:bg-gray-50">
      <div className="min-w-0">
        <div className="truncate text-base font-semibold text-slate-900">
          {post.title}
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
          <span className="capitalize">{post.visibility}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button  size="icon" className="h-10 w-3 bg-transparent hover:bg-transparent text-black p-0">
            <MoreVertical className="h-5 w-5 " />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-2 absolute -right-62">
          <DropdownMenuItem onClick={() => onAction("edit", post)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit post
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onAction("url", post)}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Post URL
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onAction("duplicate", post)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onAction("settings", post)}>
            <Settings className="mr-2 h-4 w-4" />
            Post settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onAction("unpublish", post)}
            disabled={post.status !== "published"}
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Unpublish
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onAction("qr", post)}>
            <QrCode className="mr-2 h-4 w-4" />
            Create QR code
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => onAction("delete", post)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const BlogManager: React.FC<BlogManagerProps> = ({ posts, setPosts }) => {
  const [tab, setTab] = React.useState<TabKey>("all");

  const filtered = React.useMemo<Post[]>(() => {
    if (tab === "all") return posts;
    return posts.filter((p) => p.status === tab);
  }, [posts, tab]);

  const onAction = async (action: ActionKey, post: Post): Promise<void> => {
    if (action === "delete") {
      setPosts((prev: Post[]) => prev.filter((x) => x.id !== post.id));
      return;
    }

    if (action === "duplicate") {
      setPosts((prev: Post[]) => {
        const copyPost: Post = {
          ...post,
          id: uid(),
          title: `${post.title} (copy)`,
          date: formatDate(new Date()),
        };
        const idx = prev.findIndex((x) => x.id === post.id);
        const next = [...prev];
        next.splice(idx + 1, 0, copyPost);
        return next;
      });
      return;
    }

    if (action === "unpublish") {
      setPosts((prev: Post[]) =>
        prev.map((x) =>
          x.id === post.id
            ? { ...x, status: "draft", visibility: "private" }
            : x
        )
      );
      return;
    }

    if (action === "url") {
      const url = `${window.location.origin}/blog/${post.id}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // ignore
      }
      alert(`Post URL copied:\n${url}`);
      return;
    }

    // placeholders
    alert(`${action} → ${post.title}`);
  };

  const addNewPost = (): void => {
    setPosts((prev: Post[]) => [
      ...prev,
      {
        id: uid(),
        title: "Your blog post",
        visibility: "private",
        date: formatDate(new Date()),
        status: "draft",
      },
    ]);
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      {/* Header */}
      {/* <div className="pt-2">
        <div className="text-4xl font-extrabold text-slate-900">Blog</div>
        <div className="mt-2 text-lg text-slate-500">
          Manage all of your blog posts here.
        </div>
      </div> */}

      {/* Tabs */}
      <div >
        <TabsBar tab={tab} setTab={setTab} />
      </div>

      {/* Posts */}
      <div className="mt-4 space-y-3">
        {filtered.map((post) => (
          <PostRow key={post.id} post={post} onAction={onAction} />
        ))}

        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-slate-500">
            No posts in this tab.
          </div>
        ) : null}
      </div>

      {/* Bottom actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={addNewPost}
          className="inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="h-5 w-5" />
          Add new post
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-slate-700 hover:bg-slate-50"
          aria-label="Blog settings"
          title="Blog settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white">
          🙂
        </span>
        <span>
          <span
            className="text-[var(--accent)]"
            style={
              {
                ["--accent" as unknown as string]: ACCENT,
              } as React.CSSProperties
            }
          >
            Rate this feature.
          </span>{" "}
          Help us improve.
        </span>
      </div>
    </div>
  );
};

const BlogPage: React.FC = () => {
  // ✅ If blog started => show manager. Else => show start-blog card.
  const [hasBlog, setHasBlog] = React.useState<boolean>(false);

  const [posts, setPosts] = React.useState<Post[]>([
    {
      id: uid(),
      title: "Your blog post",
      visibility: "public",
      date: "1/27/2026",
      status: "published",
    },
    {
      id: uid(),
      title: "Your blog post",
      visibility: "public",
      date: "1/27/2026",
      status: "published",
    },
    {
      id: uid(),
      title: "Your blog post",
      visibility: "public",
      date: "1/27/2026",
      status: "published",
    },
    {
      id: uid(),
      title: "Your blog post",
      visibility: "public",
      date: "1/27/2026",
      status: "published",
    },
  ]);

  const startBlog = (): void => {
    setHasBlog(true);

    // optional: ensure at least 1 post exists
    if (posts.length === 0) {
      setPosts([
        {
          id: uid(),
          title: "Your blog post",
          visibility: "private",
          date: formatDate(new Date()),
          status: "draft",
        },
      ]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-1 md:grid-cols-3">
      <div className="col-span-2 md:col-span-3">
        {!hasBlog ? (
          <EmptyStartBlog onStart={startBlog} />
        ) : (
          <div className="flex min-h-[72vh] items-start justify-center ">
            <BlogManager posts={posts} setPosts={setPosts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
