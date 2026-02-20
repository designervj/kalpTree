import React from 'react'
import { PageItem } from './pages';
import {
  GripVertical,
  Home,
  FileText,
  MoreHorizontal,
  AlertCircle,
  Pencil,
  Copy,
  EyeOff,
  KeyRound,
  Search,
  Image as ImageIcon,
  QrCode,
  Plus,
  X,
  Info,
  ChevronRight,
  Clock,
  ListPlus,
  Link2,
  Link as LinkLucide,
  Trash2,
  LayoutGrid,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { WebsitePageModel } from '@/components/admin/website/websitePage/WebsitePageType';

import { toast } from 'sonner';
import { updateWebsitePage } from '@/hooks/slices/website/WebsitePageThunk';
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");


/** click outside helper */
function useClickOutside<T extends HTMLElement>(
  onOutside: () => void,
  enabled: boolean,
) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside, enabled]);

  return ref;
}

function IconFor(item: PageItem) {
  return item.icon === "home" ? (
    <Home className="w-4 h-4" />
  ) : (
    <FileText className="w-4 h-4" />
  );
}

function SeoPill() {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "text-[12px] font-semibold",
        "bg-amber-50 text-amber-700 border border-amber-200",
        "dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/20",
      )}
    >
      <AlertCircle className="w-4 h-4" />
      SEO
    </span>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked
          ? "bg-violet-600 dark:bg-violet-500"
          : "bg-slate-300 dark:bg-slate-700",
      )}
      aria-pressed={checked}
    >
      <span
        className={cx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        )}
      />
    </button>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  rightIcon,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full px-4 py-3 flex items-center gap-3 text-left",
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          : "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5",
      )}
    >
      <span
        className={cx(
          danger ? "text-red-500" : "text-slate-700 dark:text-slate-200",
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium flex-1">{label}</span>
      {rightIcon ? <span>{rightIcon}</span> : null}
    </button>
  );
}
const PageMenu = ({
  open,
  onOpenChange,
  page,
  onMakeHomepage,
  onToggleNav,
  onCopyUrl,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  page: PageItem;
  onMakeHomepage: () => void;
  onToggleNav: () => void;
  onCopyUrl: () => void;
  onDelete: () => void;
}) => {

  const dispatch = useDispatch<AppDispatch>();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [mounted, setMounted] = React.useState(false);

  const EXTRA_LEFT_PX = 20;

  React.useEffect(() => setMounted(true), []);

  const updatePos = React.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();

    // menu width 288px (w-72). align right to trigger
    const MENU_W = 288;
    const GAP = 8;

    let left = r.right - MENU_W; // right aligned
    let top = r.bottom + GAP;

    // keep inside viewport
    const pad = 8;
    left = Math.max(pad, Math.min(left, window.innerWidth - MENU_W - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - pad));

    setPos({ top, left });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePos();

    const onScroll = () => updatePos();
    const onResize = () => updatePos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, updatePos]);

  // close on outside click + ESC
  React.useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      onOpenChange(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  const { websitePages } = useSelector((state: RootState) => state.websitePage);

  const handleMakeHomepage = async(pageData: PageItem) => {
    if (!pageData.isHomePage) {
       const currentPage = websitePages.find((page) => page._id === pageData.id);
       if (currentPage) {
          const data:WebsitePageModel={
            ...currentPage,
            isHomePage:true
          }
          const response = await dispatch(updateWebsitePage(data)).unwrap();
          if (response) {
            toast.success("Homepage updated successfully");
            onOpenChange(false);
          } 
       }
    }
  };
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cx(
          "h-9 w-9 rounded-lg grid place-items-center transition-colors bg-transprant cursor-pointer",
          "text-slate-600 hover:bg-transparent",
          "dark:text-slate-200 dark:hover:bg-white/5",
        )}
        aria-label="Open menu"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ position: "fixed", top: pos.top }}
              className={cx(
                "z-[9999] w-72 overflow-hidden rounded-2xl left-80 top-30",
                "bg-white border border-slate-200 shadow-xl",
                "dark:bg-[#0b1220] dark:border-slate-800",
              )}
            >
              <MenuItem
                icon={<Home className="w-4 h-4" />}
                label={page?.isHomePage ? "Homepage" : "Make homepage"}
                onClick={() => {
                  handleMakeHomepage(page);
                }}
                // onClick={() => {
                //   if (!page?.isHomePage) onMakeHomepage();
                //   onOpenChange(false);
                // }}
              />
              <MenuItem
                icon={<LinkLucide className="w-4 h-4" />}
                label="Page URL"
                onClick={() => {
                  onCopyUrl();
                  onOpenChange(false);
                }}
              />
              <MenuItem icon={<Pencil className="w-4 h-4" />} label="Rename" />
              <MenuItem icon={<Copy className="w-4 h-4" />} label="Duplicate" />

              <MenuItem
                icon={<EyeOff className="w-4 h-4" />}
                label={
                  page.inNavigation
                    ? "Hide from navigation"
                    : "Show in navigation"
                }
                onClick={() => {
                  onToggleNav();
                  onOpenChange(false);
                }}
              />

              <MenuItem
                icon={<KeyRound className="w-4 h-4" />}
                label="Password"
              />

              <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

              <MenuItem
                icon={<Search className="w-4 h-4" />}
                label="SEO settings"
                rightIcon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              />
              <MenuItem
                icon={<ImageIcon className="w-4 h-4" />}
                label="Social image"
              />
              <MenuItem
                icon={<QrCode className="w-4 h-4" />}
                label="Create QR code"
              />

              <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />

              <MenuItem
                icon={<Trash2 className="w-4 h-4" />}
                label="Delete"
                danger
                onClick={() => {
                  onDelete();
                  onOpenChange(false);
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export default PageMenu