"use client";

import * as React from "react";
import { Facebook, Twitter, Instagram, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type ShapeType = "dot" | "rect" | "plus";

type Shape = {
  id: string;
  type: ShapeType;
  left: number; // %
  top: number; // %
  size: number; // px
  rotate: number; // deg
  color: string;
  driftX: number; // px
  driftY: number; // px
  duration: number; // s
  delay: number; // s
};

const COLORS = [
  "#00E5FF",
  "#00FFB2",
  "#FFE100",
  "#FF5A3D",
  "#FF00F5",
  "#8B5CF6",
  "#00C2FF",
  "#FFB800",
  "#00FF7F",
];

const ACCENT = "#00CDB4"; // teal button like screenshot

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function makePositionAvoidCenter(): { left: number; top: number } {
  for (let i = 0; i < 60; i++) {
    const left = rand(2, 98);
    const top = rand(2, 98);
    const inCenter = left > 28 && left < 72 && top > 24 && top < 78;
    if (!inCenter) return { left, top };
  }
  return { left: rand(2, 98), top: rand(2, 98) };
}

function buildShapes(): Shape[] {
  const out: Shape[] = [];

  // black dots
  for (let i = 0; i < 18; i++) {
    const { left, top } = makePositionAvoidCenter();
    out.push({
      id: `dot-${i}`,
      type: "dot",
      left,
      top,
      size: rand(7, 12),
      rotate: 0,
      color: "#111111",
      driftX: rand(-20, 20),
      driftY: rand(15, 35),
      duration: rand(10, 18),
      delay: rand(0, 6),
    });
  }

  // colored rectangles
  for (let i = 0; i < 34; i++) {
    const { left, top } = makePositionAvoidCenter();
    out.push({
      id: `rect-${i}`,
      type: "rect",
      left,
      top,
      size: rand(18, 34),
      rotate: rand(0, 360),
      color: pick(COLORS),
      driftX: rand(-35, 35),
      driftY: rand(20, 55),
      duration: rand(9, 16),
      delay: rand(0, 6),
    });
  }

  // plus signs
  for (let i = 0; i < 14; i++) {
    const { left, top } = makePositionAvoidCenter();
    out.push({
      id: `plus-${i}`,
      type: "plus",
      left,
      top,
      size: rand(18, 28),
      rotate: rand(0, 360),
      color: pick(COLORS),
      driftX: rand(-30, 30),
      driftY: rand(18, 45),
      duration: rand(10, 18),
      delay: rand(0, 6),
    });
  }

  return out;
}

function ConfettiLayer() {
  const shapes = React.useMemo(() => buildShapes(), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s) => (
        <div
          key={s.id}
          className="absolute will-change-transform opacity-70"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
              animation: `floaty ${s.duration}s ease-in-out ${s.delay}s infinite`,
              ["--dx" as unknown as string]: `${s.driftX}px`,
              ["--dy" as unknown as string]: `${s.driftY}px`,
              ["--r" as unknown as string]: `${s.rotate}deg`,
            } as React.CSSProperties
          }
        >
          {s.type === "dot" ? (
            <span
              className="block rounded-full"
              style={{ width: s.size, height: s.size, background: s.color }}
            />
          ) : s.type === "rect" ? (
            <span
              className="block rounded-sm"
              style={{
                width: s.size,
                height: Math.max(6, s.size / 5),
                background: s.color,
              }}
            />
          ) : (
            <span className="relative block" style={{ width: s.size, height: s.size }}>
              <span
                className="absolute left-1/2 top-0 -translate-x-1/2 rounded-sm"
                style={{
                  width: Math.max(6, s.size / 5),
                  height: s.size,
                  background: s.color,
                }}
              />
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-sm"
                style={{
                  width: s.size,
                  height: Math.max(6, s.size / 5),
                  background: s.color,
                }}
              />
            </span>
          )}
        </div>
      ))}

      <style jsx global>{`
        @keyframes floaty {
          0% {
            transform: translate(-50%, -50%) rotate(var(--r));
          }
          50% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)))
              rotate(calc(var(--r) + 25deg));
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--r));
          }
        }
      `}</style>
    </div>
  );
}

/** Scribble border like screenshot (CSS background) */
function ScribbleFrame({ children }: { children: React.ReactNode }) {
  const pattern = `
  repeating-linear-gradient(45deg, #111 0 10px, transparent 10px 18px),
  repeating-linear-gradient(-45deg, #111 0 10px, transparent 10px 18px)
  `;

  return (
    <div
      className="rounded-none p-6"
      style={{
        backgroundImage:"url(https://static.wixstatic.com/media/338bcf1ccf184340a38279c8b9025f8d.jpg/v1/fill/w_669,h_377,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/338bcf1ccf184340a38279c8b9025f8d.jpg)",
       
      }}
    >
      <div className="bg-white p-10">{children}</div>
    </div>
  );
}

export default function ComingSoonPage() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API here
    // console.log({ email, agree })
    setOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <ConfettiLayer />

      {/* Top tiny nav */}
    

      {/* Center content */}
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center">
        <h1 className="select-none text-6xl font-extrabold leading-[0.95] tracking-[0.25em] text-slate-900 md:text-7xl">
          COMING
          <br />
          SOON
        </h1>

        <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
          We will be celebrating the launch of <br className="hidden md:block" />
          our new site very soon!
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 rounded-sm px-10 py-3 text-sm font-medium text-white shadow-sm hover:opacity-95 active:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Notify Me!
        </button>

        {/* Footer */}
        <div className="absolute bottom-10 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4 text-center">
          <div className="text-xs text-slate-500">
            © 2026 by Coming Soon. Powered and secured by{" "}
            <span className="font-semibold">KalpTree</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-slate-900">
            <a href="#" aria-label="Facebook" className="hover:opacity-70">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:opacity-70">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-70">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ✅ ShadCN Dialog popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[820px] border-0 bg-transparent p-0 shadow-none"
          // remove default close because we want big X like screenshot
        >
          {/* Big X close top-right */}
          <DialogHeader className="sr-only">Notify</DialogHeader>

          <div className="relative">
            <DialogClose asChild>
              <Button
                type="button"
                aria-label="Close"
                className="absolute -right-3 -top-3 z-10 rounded-none p-2 text-white hover:opacity-80 rounded-full w-10 h-10 "
              >
                <X className="h-10 w-10" strokeWidth={4} />
              </Button>
            </DialogClose>

            <ScribbleFrame>
              <form onSubmit={onSubscribe} className="text-left">
                <div className="text-center">
                  <div className="text-4xl font-extrabold tracking-[0.25em] text-slate-900">
                    SIGN UP NOW!
                  </div>
                  <div className="mt-4 text-sm text-slate-600">
                    And be the first to know when we go live:
                  </div>
                </div>

                <div className="mt-8">
                  <label className="text-sm font-medium text-slate-700">
                    Enter your email here <span className="text-red-500">*</span>
                  </label>

                  {/* underline style input like screenshot */}
                  <div className="mt-3">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      className="h-12 rounded-none border-0 border-b-2 border-slate-900 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                    <span>
                      Yes, subscribe me to your newsletter.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <Button
                    type="submit"
                    className="h-12 rounded-none px-10 text-sm font-medium text-white"
                    style={{ backgroundColor: ACCENT }}
                    disabled={!email || !agree}
                  >
                    Subscribe Now
                  </Button>
                </div>
              </form>
            </ScribbleFrame>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
