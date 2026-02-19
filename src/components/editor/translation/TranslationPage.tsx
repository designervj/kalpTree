"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Undo2, Redo2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebsiteLang {
  name: string;
  default: boolean;
}

interface TranslationDictionary {
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

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "kt_translation_dict_v3";

function loadDictionary(): TranslationDictionary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDictionary(dict: TranslationDictionary) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dict));
  } catch {}
}

// ─── Parse Page Texts ─────────────────────────────────────────────────────────

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

  // Try iframe / canvas
  walk(
    document.querySelector("iframe")?.contentDocument ??
      (document.querySelector("[data-editor-canvas]") as HTMLElement) ??
      document,
  );

  // Fallback: parse htmlString
  if (results.length === 0 && htmlString) {
    const parser = new DOMParser();
    walk(parser.parseFromString(htmlString, "text/html"));
  }

  // Demo fallback
  if (results.length === 0) {
    const demo = [
      { text: "Home", element: "a" },
      { text: "Explore Collection", element: "button" },
      { text: "Sculpting Personal Spaces.", element: "h1" },
      {
        text: "Minimalist furniture designed for the modern home.",
        element: "p",
      },
      { text: "The Archi Sofa", element: "h3" },
      { text: "Starting at $1,200", element: "p" },
      { text: "NEW ARRIVAL", element: "span" },
      { text: "Fast Delivery", element: "strong" },
      { text: "Doorstep shipping worldwide", element: "span" },
      { text: "Easy Returns", element: "strong" },
      { text: "14-day hassle-free policy", element: "span" },
      { text: "Free Delivery", element: "strong" },
      { text: "on orders over $999", element: "span" },
      { text: "White-Glove", element: "strong" },
      { text: "Assembly Available", element: "span" },
      { text: "The Velvet Retreat Collection", element: "span" },
      { text: "Our Bespoke Services", element: "h2" },
      { text: "Interior Design", element: "h4" },
      { text: "Custom Crafting", element: "h4" },
      { text: "White-Glove Setup", element: "h4" },
      { text: "Our Collections", element: "h2" },
      { text: "NestCraft", element: "div" },
      { text: "Shop", element: "button" },
      { text: "Furniture", element: "span" },
      { text: "Curated", element: "span" },
      { text: "Design-led essentials for every room.", element: "h3" },
      { text: "Living", element: "h3" },
      { text: "Bedroom", element: "h3" },
      { text: "Dining", element: "h3" },
      { text: "Decor", element: "h3" },
      { text: "Best Sellers", element: "p" },
      { text: "New Essentials", element: "h2" },
    ];
    demo.forEach((d) => results.push({ ...d, context: d.element }));
  }

  return results;
}

// ─── Simple Select ────────────────────────────────────────────────────────────

function SimpleSelect({
  value,
  onChange,
  options,
  placeholder,
  handleEditor,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  handleEditor?: any;
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
                  if (handleEditor != undefined) {
                    handleEditor(opt.value);
                  }
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
  // ── Derive config from currentWebsite ──

  const originalHtmlRef = React.useRef<string>(editorHtml ?? "");

  const isOwnUpdate = React.useRef(false);

  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const websiteLangs = currentWebsite?.lang;

  const defaultLang =
    websiteLangs!.find((l) => l.default)?.name ??
    websiteLangs![0]?.name ??
    "en";

  // Language options (all langs from website)
  const langOptions = websiteLangs!.map((l) => ({
    value: l.name,
    label: `${LANG_META[l.name]?.flag ?? "🌐"} ${LANG_META[l.name]?.label ?? l.name.toUpperCase()}`,
  }));

  // ── State ──
  const [activeTab, setActiveTab] = useState<"editor" | "string">("editor");
  const [selectedLang, setSelectedLang] = useState<string>(
    // Default: first non-default lang
    websiteLangs!.find((l) => !l.default)?.name ??
      websiteLangs![0]?.name ??
      "fr",
  );
  const [selectedText, setSelectedText] = useState<string>("");
  const [translationInput, setTranslationInput] = useState<string>("");
  const [dictionary, setDictionary] =
    useState<TranslationDictionary>(loadDictionary);
  const [parsedTexts, setParsedTexts] = useState<ParsedText[]>([]);
  const [isParsing, setIsParsing] = useState(true);
  const [history, setHistory] = useState<TranslationDictionary[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saved, setSaved] = useState(false);
  const [searchStr, setSearchStr] = useState("");

  // For string tab
  const [stringInput, setStringInput] = useState("");
  const [stringTranslation, setStringTranslation] = useState("");
  // ── Parse on mount ──
  useEffect(() => {
    setIsParsing(true);
    const t = setTimeout(() => {
      setParsedTexts(parsePageTexts(editorHtml));
      setIsParsing(false);
    }, 300);
    return () => clearTimeout(t);
  }, [editorHtml]);

  // ── Persist ──
  useEffect(() => {
    saveDictionary(dictionary);
  }, [dictionary]);

  // ── When text or lang changes, load existing translation ──
  useEffect(() => {
    if (!selectedText) return;
    const existing = dictionary[selectedText]?.[selectedLang] ?? "";
    setTranslationInput(existing);
  }, [selectedText, selectedLang, dictionary]);


  // ── Page text options ──
  const textOptions = useMemo(
    () =>
      parsedTexts.map((t) => ({
        value: t.text,
        label: t.text.length > 50 ? t.text.slice(0, 50) + "…" : t.text,
      })),
    [parsedTexts],
  );

  // ── Source text: what the word looks like in defaultLang ──
  const sourceText = selectedText
    ? (dictionary[selectedText]?.[defaultLang] ?? selectedText)
    : "";

  // ── Save translation ──
  const handleSave = useCallback(() => {
    if (!selectedText) return;

    const newDict: TranslationDictionary = {
      ...dictionary,
      [selectedText]: {
        // Always include defaultLang
        [defaultLang]: dictionary[selectedText]?.[defaultLang] ?? selectedText,
        ...(dictionary[selectedText] ?? {}),
        [selectedLang]: translationInput,
      },
    };

    // History for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dictionary);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setDictionary(newDict);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [
    selectedText,
    selectedLang,
    translationInput,
    dictionary,
    defaultLang,
    history,
    historyIndex,
  ]);

  // ── Discard ──
  const handleDiscard = () => {
    const existing = dictionary[selectedText]?.[selectedLang] ?? "";
    setTranslationInput(existing);
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

  // ── Save string translation ──
  const handleSaveString = () => {
    if (!stringInput.trim()) return;
    const word = stringInput.trim();
    const newDict: TranslationDictionary = {
      ...dictionary,
      [word]: {
        [defaultLang]: word,
        ...(dictionary[word] ?? {}),
        [selectedLang]: stringTranslation,
      },
    };
    setDictionary(newDict);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setStringTranslation("");
  };

  const sourceMeta = LANG_META[defaultLang] ?? {
    label: defaultLang,
    flag: "🌐",
  };
  const targetMeta = LANG_META[selectedLang] ?? {
    label: selectedLang,
    flag: "🌐",
  };

  const isDirty = selectedText
    ? translationInput !== (dictionary[selectedText]?.[selectedLang] ?? "")
    : false;

  useEffect(() => {
    if (!isOwnUpdate.current) {
      originalHtmlRef.current = editorHtml ?? "";
    }
    isOwnUpdate.current = false;
  }, [editorHtml]);

  const handleEditor = (key: string) => {
    const arrayofkeys = Object.keys(dictionary);
    let finalHtml = originalHtmlRef.current;

    arrayofkeys.forEach((d) => {
      const obj = dictionary[d];
      const value = obj[key];
      if (value && finalHtml.includes(d)) {
        finalHtml = finalHtml.split(d).join(value); // replaceAll equivalent
      }
    });

    isOwnUpdate.current = true;

    handleUpdateHtml(finalHtml);
  };

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
            {/* Language selector */}
            <div className="px-3 pt-4 pb-2">
              <SimpleSelect
                value={selectedLang}
                onChange={setSelectedLang}
                options={langOptions}
                handleEditor={handleEditor}
              />
            </div>

            {/* Green progress bar (visual) */}
            <div className="mx-3 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
              {(() => {
                const total = parsedTexts.length;
                const translated = parsedTexts.filter(
                  (t) => !!dictionary[t.text]?.[selectedLang],
                ).length;
                const pct = total > 0 ? (translated / total) * 100 : 0;
                return (
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                );
              })()}
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

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 mx-0 mb-0" />

            {/* From [Lang] — read-only source */}
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

            {/* To [Lang] — editable target */}
            <div className="px-3 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  To {targetMeta.label}
                </span>
                <span className="text-base leading-none">
                  {targetMeta.flag}
                </span>
              </div>
              <textarea
                value={translationInput}
                onChange={(e) => setTranslationInput(e.target.value)}
                rows={3}
                placeholder={`Enter ${targetMeta.label} translation…`}
                disabled={!selectedText}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-400">Text</span>
                {isDirty && (
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    Discard changes
                  </button>
                )}
              </div>

              {/* Suggestions (if any from dict) */}
              {selectedText && !dictionary[selectedText]?.[selectedLang] && (
                <p className="text-xs text-slate-400 mt-3 italic">
                  No available suggestions
                </p>
              )}

              {/* If already translated, show existing */}
              {selectedText &&
                dictionary[selectedText]?.[selectedLang] &&
                !isDirty && (
                  <div className="mt-3 px-3 py-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded text-xs text-green-700 dark:text-green-400">
                    ✓ Translation saved
                  </div>
                )}
            </div>

            {/* Save button */}
            <div className="px-3 pb-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedText || !translationInput.trim()}
                className={`w-full py-2.5 rounded text-sm font-semibold transition-all ${
                  saved
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {saved ? "✓ Saved" : "Save Translation"}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 mx-0" />

            {/* All translations in dict for this word */}
            {selectedText && dictionary[selectedText] && (
              <div className="px-3 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  All translations for this word
                </p>
                <div className="space-y-2">
                  {Object.entries(dictionary[selectedText]).map(
                    ([lang, val]) => {
                      const meta = LANG_META[lang] ?? {
                        label: lang,
                        flag: "🌐",
                      };
                      const isDefault = lang === defaultLang;
                      return (
                        <div
                          key={lang}
                          className="flex items-start gap-2.5 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <span className="text-base shrink-0">
                            {meta.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {meta.label}
                              </span>
                              {isDefault && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                                  source
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 break-words">
                              {val}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ STRING TRANSLATION TAB ════════ */}
        {activeTab === "string" && (
          <div className="flex flex-col gap-0">
            {/* Language selector */}
            <div className="px-3 pt-4 pb-3">
              <SimpleSelect
                value={selectedLang}
                onChange={setSelectedLang}
                options={langOptions.filter((l) => l.value !== defaultLang)}
                placeholder="Select target language…"
              />
            </div>

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

            {/* Target translation */}
            <div className="px-3 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  To {targetMeta.label}
                </span>
                <span className="text-base">{targetMeta.flag}</span>
              </div>
              <textarea
                value={stringTranslation}
                onChange={(e) => setStringTranslation(e.target.value)}
                rows={3}
                placeholder={`Enter ${targetMeta.label} translation…`}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-400">Text</span>
                {stringTranslation && (
                  <button
                    type="button"
                    onClick={() => setStringTranslation("")}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Discard changes
                  </button>
                )}
              </div>

              {(!stringInput || !stringTranslation) && (
                <p className="text-xs text-slate-400 mt-3 italic">
                  No available suggestions
                </p>
              )}
            </div>

            {/* Save button */}
            <div className="px-3 pb-4">
              <button
                type="button"
                onClick={handleSaveString}
                disabled={!stringInput.trim() || !stringTranslation.trim()}
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
                      const tVal = entry[selectedLang];
                      if (!tVal) return null;
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => {
                            setStringInput(entry[defaultLang] ?? word);
                            setStringTranslation(tVal);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {entry[defaultLang] ?? word}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 truncate mt-0.5">
                            {targetMeta.flag} {tVal}
                          </p>
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
