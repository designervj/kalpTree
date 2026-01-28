import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { SheetClose } from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";
import { AIAssistant } from "./AIAssistant";
import { FieldLabel } from "./FieldLabel";
import { HelperText } from "./HelperText";
import { ValidationRow } from "./ValidationRow";
import { SoftInput } from "./SoftInput";
import { SoftTextarea } from "./SoftTextarea";

export function SeoEditor({ pageName }: { pageName: string }) {
    const [hideFromSearch, setHideFromSearch] = React.useState(false);
    const [focusKeywords, setFocusKeywords] = React.useState<string[]>([]);
    const [keywordInput, setKeywordInput] = React.useState("");
    const [seoTitle, setSeoTitle] = React.useState(pageName);
    const [metaDesc, setMetaDesc] = React.useState("");
    const [slug, setSlug] = React.useState(
        pageName.toLowerCase().trim().replace(/\s+/g, "-")
    );

    React.useEffect(() => {
        setHideFromSearch(false);
        setFocusKeywords([]);
        setKeywordInput("");
        setSeoTitle(pageName);
        setMetaDesc("");
        setSlug(pageName.toLowerCase().trim().replace(/\s+/g, "-"));
    }, [pageName]);

    const titleLen = seoTitle.trim().length;
    const descLen = metaDesc.trim().length;

    const hasKeyword = focusKeywords.length > 0;
    const includesKeywordInTitle = hasKeyword
        ? focusKeywords.some((k) => seoTitle.toLowerCase().includes(k.toLowerCase()))
        : false;

    const includesKeywordInDesc = hasKeyword
        ? focusKeywords.some((k) => metaDesc.toLowerCase().includes(k.toLowerCase()))
        : false;

    const includesKeywordInSlug = hasKeyword
        ? focusKeywords.some((k) => slug.toLowerCase().includes(k.toLowerCase()))
        : false;

    const addKeyword = () => {
        const v = keywordInput.trim();
        if (!v) return;
        if (focusKeywords.length >= 3) return;
        if (focusKeywords.some((k) => k.toLowerCase() === v.toLowerCase())) return;
        setFocusKeywords((k) => [...k, v]);
        setKeywordInput("");
    };

    return (
        <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-4">
            <div className="space-y-6">
                {/* AI SEO Assistant */}
                <AIAssistant pageName={pageName} />

                {/* Search result preview */}
                <div className="space-y-3">
                    <FieldLabel>Search result preview</FieldLabel>

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
                        <CardContent className="p-4">
                            <div className="text-xl font-semibold text-violet-700 dark:text-violet-200">
                                {seoTitle || pageName}
                            </div>
                            <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                                https://minalite-mwxaixoen9uuedst.builder-preview.com
                            </div>
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Search engines automatically generate a description. To use a custom
                                description instead, enter it below.
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        It takes time for Google to update its search results with your website
                        and its changes.
                    </div>
                </div>

                {/* Hide page toggle */}
                <div className="flex items-center justify-between">
                    <FieldLabel>Hide page from search results</FieldLabel>
                    <Switch checked={hideFromSearch} onCheckedChange={setHideFromSearch} />
                </div>

                {/* Focus keyword */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <FieldLabel>Focus keyword</FieldLabel>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            {focusKeywords.length}/3
                        </div>
                    </div>

                    <HelperText>
                        To help search engines understand your content, select one focus keyword
                        or keyphrase that best represents the topic of this page
                    </HelperText>

                    <div className="flex gap-2">
                        <SoftInput
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="Add keyword..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addKeyword();
                                }
                            }}
                        />
                        <Button
                            variant="outline"
                            className="h-12 rounded-xl border-slate-200 bg-white text-violet-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
                            onClick={addKeyword}
                            disabled={focusKeywords.length >= 3}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                        </Button>
                    </div>

                    {focusKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {focusKeywords.map((k, idx) => (
                                <div
                                    key={`${k}-${idx}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
                                >
                                    {k}
                                    <button
                                        type="button"
                                        className="opacity-70 hover:opacity-100"
                                        onClick={() =>
                                            setFocusKeywords((prev) => prev.filter((_, i) => i !== idx))
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
                        <CardContent className="p-4">
                            <ValidationRow type={focusKeywords.length > 0 ? "ok" : "warn"}>
                                Focus keyword should be added and selected for this page
                            </ValidationRow>
                        </CardContent>
                    </Card>
                </div>

                {/* SEO title */}
                <div className="space-y-3">
                    <FieldLabel>SEO title</FieldLabel>

                    <SoftInput value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
                        <CardContent className="p-4 space-y-2">
                            <ValidationRow type={titleLen > 0 ? "ok" : "warn"}>
                                SEO title should not be empty
                            </ValidationRow>
                            <ValidationRow type={titleLen >= 10 && titleLen <= 60 ? "ok" : "warn"}>
                                SEO title length should be between 10 and 60 characters. The current
                                count is {titleLen} characters
                            </ValidationRow>
                            <ValidationRow type={includesKeywordInTitle ? "ok" : "warn"}>
                                SEO title should include a focus keyword
                            </ValidationRow>
                        </CardContent>
                    </Card>
                </div>

                {/* Meta description */}
                <div className="space-y-3">
                    <FieldLabel>Meta description</FieldLabel>

                    <SoftTextarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} />

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
                        <CardContent className="p-4 space-y-2">
                            <ValidationRow type={descLen > 0 ? "ok" : "warn"}>
                                Meta description should not be empty
                            </ValidationRow>
                            <ValidationRow type={descLen === 156 ? "ok" : "warn"}>
                                Meta description length should be 156 characters. The current count
                                is {descLen} characters
                            </ValidationRow>
                            <ValidationRow type={includesKeywordInDesc ? "ok" : "warn"}>
                                Meta description should include a focus keyword
                            </ValidationRow>
                        </CardContent>
                    </Card>
                </div>

                {/* Page URL */}
                <div className="space-y-3">
                    <FieldLabel>Page URL</FieldLabel>

                    <SoftInput value={slug} onChange={(e) => setSlug(e.target.value)} />

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Here&apos;s your full URL:{" "}
                        <span className="text-slate-700 dark:text-slate-200">
                            https://minalite-mwxaixoen9uuedst.builder-preview.com/{slug || ""}
                        </span>
                    </div>

                    <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
                        <CardContent className="p-4 space-y-2">
                            <ValidationRow type={includesKeywordInSlug ? "ok" : "warn"}>
                                Page URL should include a focus keyword
                            </ValidationRow>
                            <ValidationRow type="ok">
                                The slug <span className="font-semibold">"{slug || "-"}"</span>{" "}
                                should be unique and available for use.
                            </ValidationRow>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button className="rounded-xl">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="rounded-xl">
                            Cancel
                        </Button>
                    </SheetClose>
                </div>
            </div>
        </div>
    );
}
