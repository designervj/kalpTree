"use client"
import { AppDispatch, RootState } from '@/store/store';
import { ChevronDown, RefreshCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { componentCategories } from './Templatecategory';
import { Button } from '@/components/ui/button';

 type DemoKey = "All" | "Shop" | "Home" | "Products" | "Categories";
const TemplateTopBar = () => {
        const dispatch= useDispatch<AppDispatch>();
    const {allTemplate, currentTemplate, hasFetched, isLoading, error}= useSelector((state: RootState) => state.template);
 
  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<DemoKey>("All");

  // category dropdown (header list)
  const [category, setCategory] = useState<string>("hero");
    const [catOpen, setCatOpen] = useState(false);
  return (
   <>

      {/* TOP BAR */}
      <div className="border-b bg-white">
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Search */}
          <div className="relative w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Filter by Demos */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Filter by Demos</span>
            <select
              value={demo}
              onChange={(e) => {
                setDemo(e.target.value as DemoKey);
                setCategory("ALL");
              }}
              className="h-9 w-[180px] rounded border border-gray-300 bg-white px-3 text-sm outline-none"
            >
              {allTemplate.map((d) => (
                <option key={d.category + d.id} value={d.category}>
                  {d.category}
                </option>
              ))}
            </select>
          </div>  

          {/* CATEGORY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setCatOpen((p) => !p)}
              className="h-9 w-[220px] rounded border border-gray-300 bg-white px-3 text-sm outline-none flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="font-semibold tracking-wide">{category}</span>
                <span className="text-gray-500">{componentCategories.filter((c) => c.id === category).length}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-[44px] w-[260px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
                {componentCategories.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      setCategory(k.label);
                      setCatOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 flex items-center justify-between border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <span className="text-xs font-semibold tracking-widest text-gray-700">
                      {k.label}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {/* {categoryCounts[k.id] ?? 0} */}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            //onClick={onSubmit}
            // className="h-9 rounded bg-[#b18457] px-5 text-sm font-semibold text-white hover:opacity-90"
          >
            SUBMIT
          </Button>

          {/* Refresh Studio */}
          <Button
            //onClick={onRefreshStudio}
            // variant="secondary"
             className="h-9 rounded bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-950 inline-flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            REFRESH STUDIO
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button
            variant="outline"
            // className="hidden md:inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              FILTERS
            </Button>
            <button className="h-9 w-9 grid place-items-center rounded border border-gray-300 hover:bg-gray-50">
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
   </>
  )
}

export default TemplateTopBar