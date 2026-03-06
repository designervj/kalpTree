import { useState } from "react";
import { getCurrSym, cls } from "../utils/helpers";
import { Card, Btn } from "./UI";
import { Ic } from "./Icons";
import { SummarisedView } from "./SummarisedView";
import { FAQDisplay } from "./FAQ";

// ─── VIEW PACKAGE ─────────────────────────────────────────────────
export const ViewPackage = ({ pkg, onEdit }) => {
  const [tab, setTab] = useState("summary");
  const sym = getCurrSym(pkg.price?.currency);
  const [kbygOpen, setKbygOpen] = useState(true);

  const tabs = [
    ["summary", "Summary"],
    ["inclusions", "What's Inside"],
    ["kbyg", "Know Before You Go"],
    ["faqs", `FAQs${pkg.faqs?.length ? ` (${pkg.faqs.length})` : ""}`],
    ["additional", "Additional Info"],
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Hero */}
      <div className="bg-blue-950 text-white rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{pkg.title || pkg.destination}</h2>
            <p className="text-blue-300 flex items-center gap-1 mt-1"><Ic.MapPin />{pkg.destination} · {pkg.tripDuration}</p>
            {pkg.shortDescription && <p className="text-blue-200/70 text-sm mt-2 max-w-xl">{pkg.shortDescription}</p>}
            <div className="flex gap-2 mt-3 flex-wrap">
              {pkg.travelStyle && <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">{pkg.travelStyle}</span>}
              {pkg.exclusivityLevel && <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full font-medium">{pkg.exclusivityLevel}</span>}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {pkg.price?.amount && Number(pkg.price.amount) > 0 ? (
              <>
                <p className="text-3xl font-bold">{sym}{Number(pkg.price.amount).toLocaleString("en-IN")}</p>
                <p className="text-xs text-blue-400 mt-1">{pkg.price?.currency} / person</p>
              </>
            ) : <p className="text-sm text-blue-400">Price not set</p>}
            <Btn variant="secondary" size="sm" className="mt-3" onClick={onEdit}><Ic.Edit />Edit Package</Btn>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={cls("flex-shrink-0 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap", tab === key ? "border-blue-950 text-blue-950" : "border-transparent text-gray-500 hover:text-gray-700")}>
            {label}
          </button>
        ))}
      </div>

      {/* Summary Tab */}
      {tab === "summary" && <SummarisedView itinerary={pkg.itinerary || []} pkg={pkg} />}

      {/* What's Inside Tab */}
      {tab === "inclusions" && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">What's Inside the Package?</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
                Inclusions <span className="text-gray-400 font-normal">({(pkg.inclusions || []).length})</span>
              </h4>
              {(pkg.inclusions || []).length === 0 ? <p className="text-sm text-gray-400 italic">No inclusions listed</p> : (
                <ul className="space-y-2.5">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-l border-gray-200 pl-8">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">✕</div>
                Exclusions <span className="text-gray-400 font-normal">({(pkg.exclusions || []).length})</span>
              </h4>
              {(pkg.exclusions || []).length === 0 ? <p className="text-sm text-gray-400 italic">No exclusions listed</p> : (
                <ul className="space-y-2.5">
                  {pkg.exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Know Before You Go Tab */}
      {tab === "kbyg" && (
        <Card className="overflow-hidden">
          <button type="button" onClick={() => setKbygOpen((o) => !o)} className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <h3 className="text-base font-bold text-gray-900">Know Before You Go</h3>
            <Ic.Chevron open={kbygOpen} />
          </button>
          {kbygOpen && (
            <div className="px-6 py-5">
              {(pkg.knowBeforeYouGo || []).length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-6">No guidelines added</p>
              ) : (
                <ul className="space-y-3">
                  {pkg.knowBeforeYouGo.map((pt, i) => (
                    <li key={pt.id || i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-950 mt-2 flex-shrink-0" />
                      <span>{pt.point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>
      )}

      {/* FAQs Tab */}
      {tab === "faqs" && (pkg.faqs?.length > 0 ? <FAQDisplay faqs={pkg.faqs} /> : (
        <div className="py-16 text-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
          <p className="text-sm font-semibold text-blue-900">No FAQs added</p>
          <p className="text-xs text-gray-400 mt-1">Edit this package to add FAQs</p>
        </div>
      ))}

      {/* Additional Information Tab */}
      {tab === "additional" && (() => {
        const ai = pkg.additionalInfo;
        if (!ai || (!ai.aboutDestination && !ai.quickInfo?.destinationsCovered && !ai.experiencesCovered?.length && !ai.notToMiss?.length))
          return (
            <div className="py-16 text-center border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
              <p className="text-sm font-semibold text-blue-900">No additional information added</p>
              <p className="text-xs text-gray-400 mt-1">Edit this package to add destination info</p>
            </div>
          );
        return (
          <div className="space-y-4">
            {ai.aboutDestination && (
              <Card className="p-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">About the Destination</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{ai.aboutDestination}</p>
              </Card>
            )}
            {(ai.quickInfo?.destinationsCovered || ai.quickInfo?.duration || ai.quickInfo?.startPoint || ai.quickInfo?.endPoint) && (
              <Card className="p-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Info</h4>
                <div className="space-y-3">
                  {[["🗺", "Destinations Covered", "destinationsCovered"], ["📅", "Duration", "duration"], ["✈", "Start Point", "startPoint"], ["🏁", "End Point", "endPoint"]]
                    .filter(([, , k]) => ai.quickInfo?.[k])
                    .map(([icon, label, key]) => (
                      <div key={key} className="flex items-start gap-3 text-sm">
                        <span className="text-lg flex-shrink-0">{icon}</span>
                        <div><span className="font-bold text-gray-900">{label}: </span><span className="text-gray-700">{ai.quickInfo[key]}</span></div>
                      </div>
                    ))}
                </div>
              </Card>
            )}
            {ai.experiencesCovered?.length > 0 && (
              <Card className="p-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Experiences Covered</h4>
                <ul className="space-y-2.5">
                  {ai.experiencesCovered.map((exp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-violet-500 font-bold flex-shrink-0 mt-0.5">✦</span>
                      <span className="leading-snug">{exp}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            {ai.notToMiss?.length > 0 && (
              <Card className="p-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Not to Miss</h4>
                <ul className="space-y-2.5">
                  {ai.notToMiss.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="text-rose-500 font-bold flex-shrink-0 mt-0.5">★</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        );
      })()}
    </div>
  );
};
