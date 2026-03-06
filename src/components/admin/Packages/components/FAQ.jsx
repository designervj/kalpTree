import { useState, useRef } from "react";
import { emptyFaq, uid, cls } from "../utils/helpers";
import { Card, Btn, FL } from "./UI";
import { Ic } from "./Icons";

// ─── FAQ ITEM FORM ────────────────────────────────────────────────
export const FAQItemForm = ({ faq, index, onUpdate, onRemove }) => {
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);
  const prevId = useRef(faq.id);
  if (prevId.current !== faq.id) {
    prevId.current = faq.id;
    setQ(faq.question);
    setA(faq.answer);
  }

  return (
    <div className="border border-blue-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-blue-100">
        <div className="w-6 h-6 rounded-lg bg-blue-950 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{index + 1}</div>
        <p className="flex-1 text-xs font-semibold text-blue-900 truncate min-w-0">
          {q || <span className="text-gray-400 font-normal italic">Question not set</span>}
        </p>
        <button type="button" onClick={() => setOpen((o) => !o)} className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
          <Ic.Chevron open={open} />
        </button>
        <button type="button" onClick={() => onRemove(faq.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Ic.Trash />
        </button>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <div>
            <FL required>Question</FL>
            <input
              type="text" placeholder="e.g. Are flights included?" value={q}
              onChange={(e) => setQ(e.target.value)}
              onBlur={() => { if (q !== faq.question) onUpdate(faq.id, "question", q); }}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 placeholder:text-gray-400 transition-all"
            />
          </div>
          <div>
            <FL required>Answer</FL>
            <textarea
              rows={3} placeholder="Provide a clear, helpful answer…" value={a}
              onChange={(e) => setA(e.target.value)}
              onBlur={() => { if (a !== faq.answer) onUpdate(faq.id, "answer", a); }}
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 placeholder:text-gray-400 transition-all resize-none"
            />
            {a && <p className="text-xs text-gray-400 mt-1 text-right">{a.length} chars</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── FAQ SECTION (editor) ─────────────────────────────────────────
export const FAQSection = ({ faqs, onChange, sectionNum = 4 }) => {
  const addFaq = () => onChange([...faqs, emptyFaq()]);
  const removeFaq = (id) => onChange(faqs.filter((f) => f.id !== id));
  const updateFaq = (id, field, value) => onChange(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-950 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{sectionNum}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">Frequently Asked Questions</h3>
              {faqs.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  {faqs.length} FAQ{faqs.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Common traveller questions — shown as an accordion on the package page</p>
          </div>
        </div>
        <Btn variant="primary" size="sm" onClick={addFaq}><Ic.Plus />Add FAQ</Btn>
      </div>
      {faqs.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
          <p className="text-sm font-semibold text-blue-900">No FAQs added yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Add common questions travellers ask about this package</p>
          <Btn variant="soft" size="sm" onClick={addFaq}><Ic.Plus />Add your first FAQ</Btn>
        </div>
      )}
      {faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItemForm key={faq.id} faq={faq} index={i} onUpdate={updateFaq} onRemove={removeFaq} />
          ))}
          <button type="button" onClick={addFaq} className="w-full py-3 border-2 border-dashed border-blue-200 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-1.5">
            <Ic.Plus />Add another FAQ
          </button>
        </div>
      )}
    </Card>
  );
};

// ─── FAQ DISPLAY (accordion view) ────────────────────────────────
export const FAQDisplay = ({ faqs }) => {
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const PREVIEW = 5;
  if (!faqs?.length) return null;
  const visible = showAll ? faqs : faqs.slice(0, PREVIEW);
  const hasMore = faqs.length > PREVIEW;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
          <p className="text-xs text-gray-400 mt-0.5">{faqs.length} question{faqs.length > 1 ? "s" : ""}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-950 text-white flex items-center justify-center text-sm font-bold">?</div>
      </div>
      <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {visible.map((faq, i) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="bg-white">
              <button
                type="button" onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={cls("w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-all", isOpen ? "bg-blue-950 text-white" : "bg-white text-gray-800 hover:bg-blue-50")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cls("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors", isOpen ? "bg-white/20 text-white" : "bg-blue-100 text-blue-900")}>
                    {i + 1}
                  </div>
                  <span className={cls("text-sm font-semibold leading-snug", isOpen ? "text-white" : "text-gray-900")}>{faq.question}</span>
                </div>
                <div className={cls("flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all", isOpen ? "bg-white/20 text-white rotate-180" : "bg-gray-100 text-gray-500")}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={cls("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                <div className="px-5 pb-5 pt-4 bg-blue-50/60 border-t border-blue-100">
                  <div className="flex gap-3">
                    <div className="w-0.5 bg-blue-300 rounded-full flex-shrink-0 self-stretch min-h-[1.5rem]" />
                    <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <div className="mt-4 text-center">
          <button type="button" onClick={() => setShowAll((s) => !s)} className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-200 bg-white text-blue-900 text-sm font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm">
            {showAll ? <>↑ Show fewer FAQs</> : <>↓ Load {faqs.length - PREVIEW} more FAQ{faqs.length - PREVIEW > 1 ? "s" : ""}</>}
          </button>
        </div>
      )}
    </Card>
  );
};
