"use client";
import React from "react";
import { Button } from "../ui/button";
import { ShieldCheck, Users, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Promo = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user?.role != "business" && (
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border bg-black shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(124,58,237,0.95),rgba(0,0,0,0.9)_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 p-7 lg:p-9 text-white">
            <span className="w-fit rounded-md bg-white/90 text-black px-3 py-1 text-xs font-medium">
              For agencies
            </span>

            <h3 className="mt-4 text-[34px] leading-tight font-semibold text-white">
              Scale smarter with the Agency plan
            </h3>

            <p className="mt-3 max-w-2xl text-white/80 leading-relaxed">
              Host up to 300 sites on one plan with full site isolation,
              per-site access control, and 24/7 priority support — built to save
              you time and costs.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button className="rounded-xl px-6">Try now</Button>
              <div className="flex items-center gap-2 text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm text-emerald-200/90">
                  30-day money-back guarantee
                </span>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-white/90" />
                  <div className="text-[15px] font-semibold">
                    Per-website sharing
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-5 py-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-white/90" />
                  <div className="text-[15px] font-semibold">
                    30% faster load time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Promo;
