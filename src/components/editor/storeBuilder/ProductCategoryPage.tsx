"use client";

import * as React from "react";
import { ArrowLeft, GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "list" | "edit";

type Product = {
  id: string;
  title: string;
  image: string;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Cozy Wooden Armchair",
    image:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "p2",
    title: "Cozy Wooden Armchair",
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "p3",
    title: "Cozy Wooden Armchair",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "p4",
    title: "Cozy Oak Armchair",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "p5",
    title: "Cozy Wooden Armchair",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "p6",
    title: "Cozy Walnut Armchair",
    image:
      "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=1200&q=70",
  },
];

function reorder<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return next;
}

export default function CategoriesPage() {
  const [view, setView] = React.useState<View>("list");

  // drag state only needed for edit view (fine to keep here)
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const dragIdRef = React.useRef<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const onDragStart = (id: string) => {
    dragIdRef.current = id;
  };

  const onDragEnd = () => {
    dragIdRef.current = null;
    setDragOverId(null);
  };

  const onDrop = (overId: string) => {
    const activeId = dragIdRef.current;
    if (!activeId || activeId === overId) return;

    const from = products.findIndex((p) => p.id === activeId);
    const to = products.findIndex((p) => p.id === overId);
    if (from === -1 || to === -1) return;

    setProducts((prev) => reorder(prev, from, to));
    dragIdRef.current = null;
    setDragOverId(null);
  };

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto w-full max-w-[1320px]">
        {/* ===================== LIST VIEW (TOP) ===================== */}
        {view === "list" ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Categories
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 grid">
                  To show products by category on your website, add eCommerce
                  section in the editor and adjust its settings.
                  <span className="text-violet-700 dark:text-violet-200">
                    Learn more.
                  </span>
                </div>
              </div>

              <Button
                type="button"
                // className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-200"
              >
                <span className="text-lg">+</span> Add category
              </Button>
            </div>

            {/* Click this card -> hide top, show bottom */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setView("edit")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setView("edit");
              }}
              className="max-w-[360px] cursor-pointer rounded-2xl border border-slate-200 bg-white p-0 outline-none transition hover:bg-slate-50 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-[#0b1220] dark:hover:bg-white/5"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  All products
                </div>

                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300">
                10 products
              </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold underline">
                Rate category management experience.
              </span>{" "}
              Help us improve.
            </div>
          </div>
        ) : null}

        {/* ===================== EDIT VIEW (BOTTOM) ===================== */}
        {view === "edit" ? (
          <div>
            <div className="flex justify-between">
                  <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Edit category
            </h1>
            <button
              type="button"
              onClick={() => setView("list")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to categories
            </button>

          
        </div>

            <div className="mt-6 rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-[22px] font-semibold">All products</div>
              <div className="mt-2 text-sm text-slate-600">
                Use drag &amp; drop to change the order of products. The changes
                will automatically be applied to all of the sections that show
                this category.
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => {
                    const isDragOver = dragOverId === p.id;
                    const isActive = dragIdRef.current === p.id;

                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={() => onDragStart(p.id)}
                        onDragEnd={onDragEnd}
                        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          setDragOverId(p.id);
                        }}
                        onDrop={() => onDrop(p.id)}
                        className={[
                          "group relative overflow-hidden rounded-2xl border bg-white",
                          "border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.03)]",
                          "transition",
                          isDragOver ? "ring-2 ring-slate-900/10" : "",
                          isActive ? "opacity-80" : "",
                        ].join(" ")}
                     
                        title="Drag to reorder"
                      >
                        <div className="relative h-[170px] w-full overflow-hidden bg-slate-100">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />

                          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
                            <GripVertical className="h-3.5 w-3.5" />
                            Drag
                          </div>
                        </div>

                        <div className="px-4 py-4">
                          <div className="text-sm font-medium leading-snug text-slate-900">
                            {p.title}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
