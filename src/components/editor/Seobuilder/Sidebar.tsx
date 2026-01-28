import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, FileText, AlignLeft } from "lucide-react";
import { PAGES } from "./constants";
import { WarnIcon } from "./WarnIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";

export function Sidebar({
    selectedId,
    onSelect,
}: {
    selectedId: string;
    onSelect: (id: string) => void;
}) {
    const [query, setQuery] = React.useState("");
    const { websitePages, currentpage } = useSelector((state: RootState) => state.websitePage);

    // Type guard to check if currentpage is a WebsitePageModel
    const isWebsitePageModel = (page: any): page is WebsitePageModel => {
        return page && typeof page === 'object' && '_id' in page;
    };
    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return PAGES;
        return PAGES.filter((p) => p.name.toLowerCase().includes(q));
    }, [query]);

    return (
        <div className="h-full w-full bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
            <div className="px-0 pt-0">
                {/* Website overview */}
                <button
                    type="button"
                    className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
                        "hover:bg-slate-50 dark:hover:bg-white/5"
                    )}
                >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
                        <FileText className="h-4 w-4" />
                    </span>
                    <span className="text-base font-medium">Website overview</span>
                </button>

                <Separator className="my-4 bg-slate-200 dark:bg-slate-800" />

                {/* Main pages dropdown */}
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#081021] dark:text-slate-200">
                        <AlignLeft className="h-4 w-4" />
                    </span>

                    <Select defaultValue="main">
                        <SelectTrigger
                            className={cn(
                                "h-11 w-full justify-between rounded-xl",
                                "border border-slate-200 bg-white text-slate-900 shadow-sm",
                                "focus:ring-0 focus:ring-offset-0",
                                "dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100"
                            )}
                        >
                            <SelectValue placeholder="Main pages" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-800 dark:bg-[#0b1220] dark:text-slate-100">
                            <SelectGroup>
                                <SelectLabel className="text-xs text-slate-500 dark:text-slate-400">
                                    Pages
                                </SelectLabel>
                                <SelectItem value="main" className="text-sm">
                                    Main pages
                                </SelectItem>
                                <SelectItem value="product" className="text-sm">
                                    Product pages
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search */}
                <div className="mt-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search pages..."
                            className={cn(
                                "h-11 rounded-2xl bg-slate-100 pl-11 text-sm",
                                "border-transparent focus-visible:ring-2 focus-visible:ring-violet-500/40",
                                "text-slate-900 placeholder:text-slate-500",
                                "dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-400"
                            )}
                        />
                    </div>
                </div>

                {/* Pages */}
                <div className="mt-4 space-y-1">
                    {websitePages.length > 0 &&
                        websitePages.map((p:WebsitePageModel) => {
                            const active =currentpage!==null? (p._id === currentpage?._id) : false;
                            return (
                                <button
                                    key={p._id}
                                    type="button"
                                    onClick={() => onSelect(p._id)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                                        active
                                            ? "bg-violet-100/70 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                                            : "text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    <WarnIcon />
                                    <span className={cn("text-sm", active ? "font-medium" : "font-normal")}>
                                        {p.title}
                                    </span>
                                </button>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
