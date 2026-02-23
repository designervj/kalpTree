"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Undo2, Redo2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { sample_dictionary } from "@/utils/samples";

export interface TranslationDictionary {
  [word: string]: { [lang: string]: string };
}

interface ParsedText {
  text: string;
  element: string;
  context?: string;
}

// ─── Supported Languages Meta ─────────────────────────────────────────────────

const LANG_META: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  fr: { label: "French", flag: "🇫🇷" },
  de: { label: "German", flag: "🇩🇪" },
  es: { label: "Spanish", flag: "🇪🇸" },
  it: { label: "Italian", flag: "🇮🇹" },
  pt: { label: "Portuguese", flag: "🇧🇷" },
  nl: { label: "Dutch", flag: "🇳🇱" },
  ar: { label: "Arabic", flag: "🇸🇦" },
  zh: { label: "Chinese", flag: "🇨🇳" },
  ja: { label: "Japanese", flag: "🇯🇵" },
  ko: { label: "Korean", flag: "🇰🇷" },
  hi: { label: "Hindi", flag: "🇮🇳" },
};

function parsePageTexts(htmlString?: string): ParsedText[] {
  const results: ParsedText[] = [];
  const seen = new Set<string>();

  const walk = (root: Document | HTMLElement | null) => {
    if (!root) return;
    const body = (root as Document).body ?? root;
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (["script", "style", "noscript", "head", "meta"].includes(tag))
          return NodeFilter.FILTER_REJECT;
        const text = node.textContent?.trim();
        if (!text || text.length < 2) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim() ?? "";
      if (seen.has(text)) continue;
      seen.add(text);
      const el = (node.parentElement?.tagName ?? "span").toLowerCase();
      results.push({ text, element: el });
    }
  };

  walk(
    document.querySelector("iframe")?.contentDocument ??
      (document.querySelector("[data-editor-canvas]") as HTMLElement) ??
      document,
  );

  if (results.length === 0 && htmlString) {
    const parser = new DOMParser();
    walk(parser.parseFromString(htmlString, "text/html"));
  }

  return results;
}

// ─── Simple Select ────────────────────────────────────────────────────────────

function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 rounded focus:outline-none focus:border-blue-500 hover:border-slate-400 transition-colors"
      >
        <span>{selected?.label ?? placeholder ?? "Select…"}</span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-px bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded shadow-lg z-50 max-h-52 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  opt.value === value
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 font-medium"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TranslationEditorProps {
  editorHtml?: string;
  handleUpdateHtml: any;
}

export default function TranslationEditor({
  editorHtml,
  handleUpdateHtml,
}: TranslationEditorProps) {
  const originalHtmlRef = React.useRef<string>(editorHtml ?? "");
  const isOwnUpdate = React.useRef(false);

  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);


  const {
    page,
    type,
    isLoading: isPageLoading,
  } = useSelector((state: RootState) => state.pageEdit);

  const { currentLLMSetting } = useSelector(
    (state: RootState) => state.llmSetting,
  );

  const [isConverting, setIsConverting] = useState(false);

  const websiteLangs = currentBusiness?.website?.lang ?? [];
  const defaultLang =
    websiteLangs.find((l) => l.default)?.name ?? websiteLangs[0]?.name ?? "en";

  // All non-default langs — these get their own translation box
  const targetLangs = websiteLangs.filter((l) => !l.default);

  // Language options for the preview selector (all langs)
  const langOptions = websiteLangs.map((l) => ({
    value: l.name,
    label: `${LANG_META[l.name]?.flag ?? "🌐"} ${LANG_META[l.name]?.label ?? l.name.toUpperCase()}`,
  }));

  // ── State ──
  const [activeTab, setActiveTab] = useState<"editor" | "string">("editor");

  // This selector ONLY controls which language HTML is previewed in the editor
  const [previewLang, setPreviewLang] = useState<string>(defaultLang);

  const [selectedText, setSelectedText] = useState<string>("");

  // Per-language translation inputs: { [lang]: string }
  const [translationInputs, setTranslationInputs] = useState<
    Record<string, string>
  >({});

  const [dictionary, setDictionary] = useState<TranslationDictionary>(
    page?.dictionary!,
  );
  const [parsedTexts, setParsedTexts] = useState<ParsedText[]>([]);
  const [isParsing, setIsParsing] = useState(true);
  const [history, setHistory] = useState<TranslationDictionary[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saved, setSaved] = useState(false);

  // For string tab
  const [stringInput, setStringInput] = useState("");
  const [stringTranslations, setStringTranslations] = useState<
    Record<string, string>
  >({});

  // ── Parse on mount ──
  useEffect(() => {
    setIsParsing(true);
    const t = setTimeout(() => {
      setParsedTexts(parsePageTexts(editorHtml));
      setIsParsing(false);
    }, 300);
    return () => clearTimeout(t);
  }, [editorHtml]);

  // ── Persist dictionary ──
  // useEffect(() => {
  //   saveDictionary(dictionary);
  // }, [dictionary]);

  // ── When selectedText changes, load all existing translations into inputs ──
  useEffect(() => {
    if (!selectedText) {
      setTranslationInputs({});
      return;
    }
    const existing: Record<string, string> = {};
    targetLangs.forEach((l) => {
      existing[l.name] = dictionary[selectedText]?.[l.name] ?? "";
    });
    setTranslationInputs(existing);
  }, [selectedText, dictionary]);
  // Note: intentionally not including targetLangs/dictionary as deps to avoid reset on every keystroke

  // ── Page text options ──
  const textOptions = useMemo(
    () =>
      parsedTexts.map((t) => ({
        value: t.text,
        label: t.text.length > 50 ? t.text.slice(0, 50) + "…" : t.text,
      })),
    [parsedTexts],
  );

  // ── Source text ──
  const sourceText = selectedText
    ? (dictionary[selectedText]?.[defaultLang] ?? selectedText)
    : "";

  const sourceMeta = LANG_META[defaultLang] ?? {
    label: defaultLang,
    flag: "🌐",
  };

  // ── Save ALL translations at once ──
  const handleSave = useCallback(async () => {
    if (!selectedText) return;

    try {
      const newDict: TranslationDictionary = {
        ...dictionary,
        [selectedText]: {
          [defaultLang]:
            dictionary[selectedText]?.[defaultLang] ?? selectedText,
          ...(dictionary[selectedText] ?? {}),
          ...translationInputs,
        },
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(dictionary);

      const req = await fetch(`/api/pages/${page?._id}`, {
        method: "PUT",
        body: JSON.stringify(newDict),
      });

      const res = await req.json();

      if (res.success) {
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setDictionary(newDict);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        toast.success(res.message);
      } else {
        setSaved(false);
      }
    } catch (error) {
      setSaved(false);
      toast.error(String(error));
    }
  }, [
    selectedText,
    translationInputs,
    dictionary,
    defaultLang,
    history,
    historyIndex,
  ]);

  // const handleConvertAllWithAI = async () => {
  //   try {
  //     const finalData = {
  //       sample_dictionary: sample_dictionary,
  //       parsedTexts,
  //       lang: websiteLangs,
  //       apiKey: currentLLMSetting.secreteKey,
  //       model: currentLLMSetting.model,
  //     };

  //     const array = parsedTexts.map((d: any) => d.text);
  //     const finalText = [...new Set(array)];

  //     console.log(finalText);

  //     const req = await fetch("/api/admin/llm/translator", {
  //       method: "POST",
  //       body: JSON.stringify(finalData),
  //     });

  //     const res = await req.json();

  //     if (res.success) {
  //       const parseObj = JSON.parse(res.data);
  //       console.log("=====>>>",parseObj)
  //       const innerreq = await fetch(`/api/pages/${page?._id}`, {
  //         method: "PUT",
  //         body: JSON.stringify(parseObj),
  //       });
  //       const innerRes = await innerreq.json();

  //       if (innerRes.success) {
  //         setDictionary(parseObj);
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(String(error));
  //   }
  // };

  // ── Discard ──

  const handleConvertAllWithAI = async () => {
    if (isConverting) return;

    try {
      setIsConverting(true);

      const finalData = {
        sample_dictionary: sample_dictionary,
        parsedTexts,
        lang: websiteLangs,
        apiKey: currentLLMSetting.secreteKey,
        model: currentLLMSetting.model,
      };

      const array = parsedTexts.map((d: any) => d.text);
      const finalText = [...new Set(array)];


      const req = await fetch("/api/admin/llm/translator", {
        method: "POST",
        body: JSON.stringify(finalData),
      });

      const res = await req.json();

      if (res.success) {
        const innerreq = await fetch(`/api/pages/${page?._id}`, {
          method: "PUT",
          body: JSON.stringify(res.data),
        });

        const innerRes = await innerreq.json();

        if (innerRes.success) {
          setDictionary(res.data);
          toast.success("Translations generated successfully");
        } else {
          toast.error(innerRes.message || "Failed to save translated data");
        }
      } else {
        toast.error(res.message || "Translation failed");
      }
    } catch (error) {
      toast.error(String(error));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDiscard = () => {
    if (!selectedText) return;
    const reset: Record<string, string> = {};
    targetLangs.forEach((l) => {
      reset[l.name] = dictionary[selectedText]?.[l.name] ?? "";
    });
    setTranslationInputs(reset);
  };

  // ── Undo / Redo ──
  const handleUndo = () => {
    if (historyIndex < 0) return;
    setDictionary(history[historyIndex]);
    setHistoryIndex((i) => i - 1);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    setDictionary(history[historyIndex + 1]);
    setHistoryIndex((i) => i + 1);
  };

  // ── Preview lang change: swap HTML in editor ──
  const handlePreviewLangChange = (lang: string) => {
    setPreviewLang(lang);

    const arrayofkeys = Object.keys(dictionary);
    let finalHtml = originalHtmlRef.current;

    arrayofkeys.forEach((d) => {
      const obj = dictionary[d];
      const value = obj[lang];
      if (value && finalHtml.includes(d)) {
        finalHtml = finalHtml.split(d).join(value);
      }
    });

    isOwnUpdate.current = true;
    handleUpdateHtml(finalHtml);
  };

  useEffect(() => {
    if (!isOwnUpdate.current) {
      originalHtmlRef.current = editorHtml ?? "";
    }
    isOwnUpdate.current = false;
  }, [editorHtml]);

  // ── Dirty check: any lang has unsaved changes ──
  const isDirty = selectedText
    ? targetLangs.some(
        (l) =>
          (translationInputs[l.name] ?? "") !==
          (dictionary[selectedText]?.[l.name] ?? ""),
      )
    : false;

  // ── Save string translations ──
  const handleSaveString = () => {
    if (!stringInput.trim()) return;
    const word = stringInput.trim();
    const newDict: TranslationDictionary = {
      ...dictionary,
      [word]: {
        [defaultLang]: word,
        ...(dictionary[word] ?? {}),
        ...stringTranslations,
      },
    };
    setDictionary(newDict);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setStringTranslations({});
  };

  // ── Progress: how many source texts have ALL target langs translated ──
  const progressPct = useMemo(() => {
    const total = parsedTexts.length * targetLangs.length;
    if (total === 0) return 0;
    let translated = 0;
    parsedTexts.forEach((t) => {
      targetLangs.forEach((l) => {
        if (dictionary[t.text]?.[l.name]) translated++;
      });
    });
    return (translated / total) * 100;
  }, [parsedTexts, targetLangs, dictionary]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm select-none">
      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { key: "editor", label: "Translation Editor" },
          { key: "string", label: "String Translation" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === key
                ? "border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ════════ TRANSLATION EDITOR TAB ════════ */}
        {activeTab === "editor" && (
          <div className="flex flex-col gap-0">
            {/* 
              ── Language selector ──
              This ONLY changes which language is previewed in the editor canvas.
              It does NOT control which translation box is shown.
            */}
            <div className="px-3 pt-4 pb-2">
              <SimpleSelect
                value={previewLang}
                onChange={handlePreviewLangChange}
                options={langOptions}
              />
            </div>

            {/* Progress bar */}
            <div className="mx-3 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Page text selector */}
            <div className="px-3 pb-3">
              {isParsing ? (
                <div className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded text-slate-400 text-sm">
                  Loading texts…
                </div>
              ) : (
                <SimpleSelect
                  value={selectedText}
                  onChange={setSelectedText}
                  options={textOptions}
                  placeholder="Select a text to translate…"
                />
              )}
            </div>

            {/* Undo / Redo */}
            <div className="flex justify-end gap-1 px-3 pb-3">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyIndex < 0}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            {/* From [defaultLang] — read-only source */}
            <div className="px-3 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  From {sourceMeta.label}
                </span>
                <span className="text-base leading-none">
                  {sourceMeta.flag}
                </span>
              </div>
              <textarea
                readOnly
                value={sourceText}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm resize-none focus:outline-none cursor-default leading-relaxed"
                placeholder="Select a text above…"
              />
              <p className="text-xs text-slate-400 mt-1">Text</p>
            </div>

            {/* 
              ── One "To [Lang]" textarea per target language ──
              All shown simultaneously so you can fill them all at once.
            */}
            {targetLangs.map((lang) => {
              const meta = LANG_META[lang.name] ?? {
                label: lang.name.toUpperCase(),
                flag: "🌐",
              };
              const value = translationInputs[lang.name] ?? "";
              const savedValue = dictionary[selectedText]?.[lang.name] ?? "";
              const isLangDirty = value !== savedValue;
              const isLangSaved = !isLangDirty && !!savedValue;

              return (
                <div key={lang.name} className="px-3 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      To {meta.label}
                    </span>
                    <span className="text-base leading-none">{meta.flag}</span>
                  </div>
                  <textarea
                    value={value}
                    onChange={(e) =>
                      setTranslationInputs((prev) => ({
                        ...prev,
                        [lang.name]: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder={`Enter ${meta.label} translation…`}
                    disabled={!selectedText}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">Text</span>
                    {isLangDirty && (
                      <button
                        type="button"
                        onClick={() =>
                          setTranslationInputs((prev) => ({
                            ...prev,
                            [lang.name]: savedValue,
                          }))
                        }
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        Discard changes
                      </button>
                    )}
                  </div>

                  {selectedText && !isLangDirty && !savedValue && (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      No available suggestions
                    </p>
                  )}

                  {isLangSaved && (
                    <div className="mt-2 px-3 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded text-xs text-green-700 dark:text-green-400">
                      ✓ Translation saved
                    </div>
                  )}
                </div>
              );
            })}

            {/* Save all button */}
            <div className="px-3 pb-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  !selectedText ||
                  targetLangs.every(
                    (l) => !(translationInputs[l.name] ?? "").trim(),
                  )
                }
                className={`w-full py-2.5 rounded text-sm font-semibold transition-all ${
                  saved
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {saved ? "✓ Saved" : "Save Translation"}
              </button>
            </div>

            <div className="px-3 pb-6">
              <button
                type="button"
                onClick={handleConvertAllWithAI}
                disabled={isConverting || isParsing || parsedTexts.length === 0}
                className="w-full py-2.5 rounded text-sm font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert With AI"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ════════ STRING TRANSLATION TAB ════════ */}
        {activeTab === "string" && (
          <div className="flex flex-col gap-0">
            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            {/* Source string input */}
            <div className="px-3 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  From {sourceMeta.label}
                </span>
                <span className="text-base">{sourceMeta.flag}</span>
              </div>
              <textarea
                value={stringInput}
                onChange={(e) => setStringInput(e.target.value)}
                rows={3}
                placeholder={`Enter ${sourceMeta.label} string…`}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
              />
              <p className="text-xs text-slate-400 mt-1">Text</p>
            </div>

            {/* One textarea per target language */}
            {targetLangs.map((lang) => {
              const meta = LANG_META[lang.name] ?? {
                label: lang.name.toUpperCase(),
                flag: "🌐",
              };
              const value = stringTranslations[lang.name] ?? "";

              return (
                <div key={lang.name} className="px-3 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      To {meta.label}
                    </span>
                    <span className="text-base">{meta.flag}</span>
                  </div>
                  <textarea
                    value={value}
                    onChange={(e) =>
                      setStringTranslations((prev) => ({
                        ...prev,
                        [lang.name]: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder={`Enter ${meta.label} translation…`}
                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">Text</span>
                    {value && (
                      <button
                        type="button"
                        onClick={() =>
                          setStringTranslations((prev) => ({
                            ...prev,
                            [lang.name]: "",
                          }))
                        }
                        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Discard changes
                      </button>
                    )}
                  </div>
                  {!stringInput && !value && (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      No available suggestions
                    </p>
                  )}
                </div>
              );
            })}

            {/* Save button */}
            <div className="px-3 pb-4">
              <button
                type="button"
                onClick={handleSaveString}
                disabled={
                  !stringInput.trim() ||
                  targetLangs.every(
                    (l) => !(stringTranslations[l.name] ?? "").trim(),
                  )
                }
                className={`w-full py-2.5 rounded text-sm font-semibold transition-all ${
                  saved
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {saved ? "✓ Saved" : "Save Translation"}
              </button>
            </div>

            {/* Existing string translations */}
            {Object.keys(dictionary).length > 0 && (
              <>
                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                <div className="px-3 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Saved Strings
                  </p>
                  <div className="space-y-2">
                    {Object.entries(dictionary).map(([word, entry]) => {
                      const hasAnyTarget = targetLangs.some(
                        (l) => !!entry[l.name],
                      );
                      if (!hasAnyTarget) return null;
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => {
                            setStringInput(entry[defaultLang] ?? word);
                            const loaded: Record<string, string> = {};
                            targetLangs.forEach((l) => {
                              loaded[l.name] = entry[l.name] ?? "";
                            });
                            setStringTranslations(loaded);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {entry[defaultLang] ?? word}
                          </p>
                          {targetLangs.map((l) =>
                            entry[l.name] ? (
                              <p
                                key={l.name}
                                className="text-xs text-blue-600 dark:text-blue-400 truncate mt-0.5"
                              >
                                {LANG_META[l.name]?.flag ?? "🌐"}{" "}
                                {entry[l.name]}
                              </p>
                            ) : null,
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
