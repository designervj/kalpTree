"use client";

import { RootState } from "@/store/store";
import { Plus, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
import { useRouter } from "next/navigation";

type Props = {
  selectedTemplate: (value: TemplateDocument[]) => void;
};

type ViewTab = "all" | "my";

// ✅ Change this route if needed
const ADD_TEMPLATE_ROUTE = "/admin/templates/create";

// ✅ Special dummy card id (for Add Template box in grid)
const ADD_CARD_ID = "__add_template__";

/** ✅ Temporary static templates for "My Templates" */
const STATIC_MY_TEMPLATES: TemplateDocument[] = [
  {
    id: "static-1",
    _id: "static-1",
    title: "Starter Landing",
    name: "Starter Landing",
    slug: "starter-landing",
    category: "page",
    isMy: true,
  } as any,
  {
    id: "static-2",
    _id: "static-2",
    title: "Hero Section Pro",
    name: "Hero Section Pro",
    slug: "hero-section-pro",
    category: "hero",
    isMy: true,
  } as any,
];

function mergeUnique(a: TemplateDocument[], b: TemplateDocument[]) {
  const out: TemplateDocument[] = [];
  const seen = new Set<string>();

  const keyOf = (t: any) =>
    String(t?._id || t?.id || t?.slug || t?.title || t?.name || "");

  [...a, ...b].forEach((t: any) => {
    const k = keyOf(t);
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(t);
  });

  return out;
}

const TemplateTopBar = ({ selectedTemplate }: Props) => {
  const router = useRouter();
  const { allTemplate } = useSelector((state: RootState) => state.template);

  const [search, setSearch] = useState("");
  const [demo, setDemo] = useState<string>("all");
  const [view, setView] = useState<ViewTab>("all");
   const {currentWebsite}= useSelector((state:RootState)=>state.websites)
  /** ✅ Prevent infinite loop (selectedTemplate identity changes in parent) */
  const selectedTemplateRef = useRef(selectedTemplate);
  useEffect(() => {
    selectedTemplateRef.current = selectedTemplate;
  }, [selectedTemplate]);

  // ✅ Add Template dummy card (stable)
  const ADD_TEMPLATE_CARD = useMemo(() => {
    return {
      id: ADD_CARD_ID,
      _id: ADD_CARD_ID,
      title: "Add Template",
      name: "Add Template",
      slug: "add-template",
      category: "add",
      isAddCard: true, // ✅ use this flag in grid
    } as any as TemplateDocument;
  }, []);

  const getCategory = useCallback((t: any) => {
    return String(t?.category || "").toLowerCase();
  }, []);

  const getSearchText = useCallback(
    (t: any) => {
      return [
        t?.title,
        t?.name,
        t?.label,
        t?.slug,
        t?.description,
        getCategory(t),
        Array.isArray(t?.tags) ? t.tags.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    },
    [getCategory]
  );

  /** ✅ dropdown categories */
  const demoOptions = useMemo(() => {
  
    
    const set = new Set<string>();

    (allTemplate || []).forEach((t: any) => {
      const c = getCategory(t);
      if (c) set.add(c);
    });

    STATIC_MY_TEMPLATES.forEach((t: any) => {
      const c = getCategory(t);
      if (c) set.add(c);
    });

    return ["all", ...Array.from(set)];
  }, [allTemplate, getCategory,currentWebsite]);

  const myTemplate= useMemo(()=>{
    return allTemplate.filter(item=>item?.websiteId===currentWebsite?._id?.toString())
  },[allTemplate,currentWebsite])

  console.log("myTemplate",myTemplate)
  /** ✅ My templates list (static + (isMy==true from API)) */
  // const myTemplates = useMemo(() => {
  //   const realMy = (allTemplate || []).filter((t: any) => t?.isMy === true);
  //   return mergeUnique(STATIC_MY_TEMPLATES, realMy);
  // }, [allTemplate]);

  /** ✅ FINAL filtered list (no setState here) */
  const filteredTemplates = useMemo(() => {
    let list: TemplateDocument[] =
      view === "my" ? myTemplate : (allTemplate || []);

    // demo filter
    if (demo !== "all") {
      const d = demo.toLowerCase();
      list = list.filter((t: any) => getCategory(t) === d);
    }

    // search filter (ALL + MY)
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t: any) => getSearchText(t).includes(q));
    }

    // ✅ Always show Add Template card as FIRST item
    return [ADD_TEMPLATE_CARD, ...list];
  }, [
    allTemplate,
    myTemplate,
    view,
    demo,
    search,
    getCategory,
    getSearchText,
    ADD_TEMPLATE_CARD,
  ]);

  /** ✅ Call parent only when filteredTemplates changes */
  useEffect(() => {
    selectedTemplateRef.current(filteredTemplates);
  }, [filteredTemplates]);

  return (
    <div className="border-b bg-white">
      <div className="flex flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-9"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter by Demos */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Filter by Demos
          </span>

          <Select value={demo} onValueChange={setDemo}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Select demo" />
            </SelectTrigger>

            <SelectContent>
              {demoOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ✅ Right Actions */}
        <div className="sm:ml-auto flex items-center gap-2">
          {/* <Button
            type="button"
            className="h-9 px-4"
            onClick={() => router.push(ADD_TEMPLATE_ROUTE)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button> */}

          <Button
            type="button"
            variant={view === "my" ? "default" : "outline"}
            className="h-9 px-4"
            onClick={() => setView("my")}
          >
            My Templates ({myTemplate?.length})
          </Button>

          <Button
            type="button"
            variant={view === "all" ? "default" : "outline"}
            className="h-9 px-4"
            onClick={() => setView("all")}
          >
            All ({(allTemplate || []).length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateTopBar;
