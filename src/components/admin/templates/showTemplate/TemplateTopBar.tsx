"use client";
import { AppDispatch, RootState } from "@/store/store";
import {
  ChevronDown,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { componentCategories } from "./Templatecategory";
import { Button } from "@/components/ui/button";
import { TemplateDocument } from "../TemplateType";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  selectedTemplate: (value: TemplateDocument[]) => void
}
const TemplateTopBar = ({ selectedTemplate }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { allTemplate, currentTemplate, hasFetched, isLoading, error } =
    useSelector((state: RootState) => state.template);

  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<string>("");

  // category dropdown (header list)
  const [category, setCategory] = useState<string>("hero");
  const [catOpen, setCatOpen] = useState(false);

  const getUniqueCategories = () => {
    const uniqueCategories = new Set(allTemplate.map((d) => d.category));
    return ["all", ...Array.from(uniqueCategories)];
  };


  const onSubmit = (value: string) => {
    if (value === "all") {
      selectedTemplate(allTemplate)
      return
    }
    const selected = allTemplate.filter((d) => d.category === value);

    selectedTemplate(selected)
  }
  return (
    <>
      {/* TOP BAR */}
      <div className="border-b bg-white">
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Search */}
          <div className="relative w-[220px]">
           
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              // className="h-9 w-full rounded border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Filter by Demos */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Filter by Demos
            </span>

            <Select
              value={demo}
              onValueChange={(value) => {
                onSubmit(value);
                setDemo(value);
                setCategory("ALL");
              }}
            >
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Select demo" />
              </SelectTrigger>

              <SelectContent>
                {getUniqueCategories()
                  .filter((d): d is string => Boolean(d))
                  .map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* CATEGORY DROPDOWN */}
          {/* <div className="relative">
            <button
              onClick={() => setCatOpen((p) => !p)}
              className="h-9 w-[220px] rounded border border-gray-300 bg-white px-3 text-sm outline-none flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="font-semibold tracking-wide">{category}</span>
                <span className="text-gray-500">
                  {componentCategories.filter((c) => c.id === category).length}
                </span>
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
                    
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {/* Submit */}


          {/* <div className="ml-auto flex items-center gap-2"> */}
            {/* <Button
            >
              SUBMIT
            </Button> */}

            {/* Refresh Studio */}
            {/* <Button
              className="h-9 rounded bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-950 inline-flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              REFRESH STUDIO a
            </Button> */}

            {/* <Button
              variant="outline"
          
            >
              <SlidersHorizontal className="h-4 w-4" />
              FILTERS
            </Button> */}
            {/* <button className="h-9 w-9 grid place-items-center rounded border border-gray-300 hover:bg-gray-50">
              <X className="h-4 w-4 text-gray-600" />
            </button> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default TemplateTopBar;
