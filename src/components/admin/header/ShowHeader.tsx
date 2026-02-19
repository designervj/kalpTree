"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createHeader } from "@/hooks/slices/header/HeaderThunk";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TemplateDocument } from "../templates/TemplateType";
import ShowCurrentHeader from "./ShowCurrentHeader";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutTemplate,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
  Eye,
  ArrowLeft,
} from "lucide-react";
import ShowHeaderHtml from "./ShowHeaderHtml";

const ShowHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allHeader } = useSelector((state: RootState) => state.header);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { curretAgency } = useSelector((state: RootState) => state.agency);

  const router = useRouter();

  const [savingId, setSavingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ this will control: list vs focused preview
  const [selectedHeader, setSelectedHeader] = useState<TemplateDocument | null>(
    null
  );

  const totalTemplates = useMemo(() => allHeader?.length || 0, [allHeader]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHeader(null);
  };

  const handleBackToList = () => {
    setSelectedHeader(null);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleSaveHeader = async (header: TemplateDocument) => {
    if (!currentWebsite?._id || !currentWebsite?.tenantId) {
      toast.error("Please select a website first");
      return;
    }

    if (!header._id || !header.content) {
      toast.error("Invalid header data");
      return;
    }

    setSavingId(header._id.toString());

    const data = {
      slug: header.slug,
      tenantId: currentWebsite.tenantId,
      websiteId: currentWebsite._id,
      content: header.content,
    };

    try {
      const result = await dispatch(createHeader(data));

      if (createHeader.fulfilled.match(result)) {
        toast.success("Header saved successfully!");
        handleCloseModal();
      } else {
        toast.error("Failed to save header");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSavingId(null);
    }
  };

  const handleAddHeader = () => {
    router.push(
      `/admin/websites/${currentWebsite?.primaryDomain?.[0]}/website/header/create?businessid=${currentBusiness?._id}&agencyid=${curretAgency?._id}`
    );
  };

  const handlePreview = (header: TemplateDocument) => {
    // ✅ show focused preview, hide list
    setSelectedHeader(header);

    // optional: scroll modal to top
    requestAnimationFrame(() => {
      const el = document.getElementById("header-templates-modal-body");
      if (el) el.scrollTop = 0;
    });
  };

  return (
    <div className="space-y-6">
      <ShowCurrentHeader />

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleOpenModal}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <LayoutTemplate className="mr-2 h-4 w-4" />
          Show all Headers
        </Button>

        <Button onClick={handleAddHeader} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Header
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
            onClick={handleCloseModal}
          />

          {/* Dialog */}
          <div className="relative z-10 flex h-full items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-[96vw] overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-2xl">
              {/* Header */}
              <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-violet-600 p-1.5 text-white">
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <h2 className="truncate text-lg sm:text-xl font-semibold text-slate-900">
                        Header Templates
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      Browse and apply a header template to{" "}
                      <span className="font-medium text-slate-800">
                        {currentWebsite?.primaryDomain?.[0] || "selected website"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden sm:inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      {totalTemplates} Templates
                    </div>

                    <button
                      onClick={handleCloseModal}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div
                id="header-templates-modal-body"
                className="max-h-[76vh] overflow-y-auto bg-slate-50/70 p-4 sm:p-6"
              >
                {/* ✅ If selectedHeader exists => show ONLY focused preview */}
                {selectedHeader ? (
                  <div className="rounded-2xl border border-violet-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 bg-violet-50/60 px-4 py-3">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="outline"
                          className="h-8 px-2"
                          onClick={handleBackToList}
                        >
                          <ArrowLeft className="mr-1 h-4 w-4" />
                          Back
                        </Button>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Focused Preview
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {selectedHeader._id?.toString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSaveHeader(selectedHeader)}
                        disabled={savingId === selectedHeader._id?.toString()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {savingId === selectedHeader._id?.toString() ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          "Save This Header"
                        )}
                      </Button>
                    </div>

                    {/* Full height preview */}
                    <div className="h-[520px] overflow-auto bg-white">
                      <ShowHeaderHtml html={selectedHeader?.content || ""} />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* ✅ Otherwise show ONLY template list (grid) */}
                    {!allHeader || allHeader.length === 0 ? (
                      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <LayoutTemplate className="mb-3 h-10 w-10 text-slate-400" />
                        <h3 className="text-base font-semibold text-slate-800">
                          No header templates found
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Add a new header template to get started.
                        </p>
                        <Button
                          onClick={handleAddHeader}
                          variant="outline"
                          className="mt-4"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Header
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {allHeader.map((header, idx) => {
                          const headerKey =
                            header._id?.toString() || `header-${idx}`;
                          const isSaving = savingId === header._id?.toString();

                          return (
                            <div
                              key={headerKey}
                              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200"
                            >
                              {/* Card header */}
                              <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/70 px-3 py-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-800">
                                    Header Template {idx + 1}
                                  </p>
                                  <p className="truncate text-xs text-slate-500">
                                    ID:{" "}
                                    <span className="font-mono">
                                      {header._id?.toString() || "N/A"}
                                    </span>
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => handlePreview(header)}
                                  >
                                    <Eye className="mr-1 h-3.5 w-3.5" />
                                    Preview
                                  </Button>

                                  <Button
                                    onClick={() => handleSaveHeader(header)}
                                    disabled={isSaving}
                                    className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {isSaving ? (
                                      <span className="flex items-center gap-1">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Saving...
                                      </span>
                                    ) : (
                                      "Save Header"
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Small preview (optional) */}
                              <div className="p-3">
                                <div className="overflow-hidden rounded-xl border border-violet-100 bg-white">
                                  <div className="border-b border-violet-100 bg-violet-50/60 px-3 py-2">
                                    <p className="text-xs font-medium text-violet-700">
                                      Live Preview
                                    </p>
                                  </div>

                                  <div className="h-[220px] overflow-auto bg-white">
                                    <ShowHeaderHtml html={header?.content || ""} />
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                    {header.slug ? (
                                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
                                        {header.slug}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
                                        Template #{idx + 1}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handlePreview(header)}
                                    className="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-700"
                                  >
                                    Focus
                                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
                <div className="text-xs text-slate-500">
                  {selectedHeader ? (
                    <>
                      Previewing:{" "}
                      <span className="font-mono text-slate-700">
                        {selectedHeader._id?.toString()}
                      </span>
                    </>
                  ) : (
                    "Click Preview to open focused preview"
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!selectedHeader && (
                    <Button onClick={handleAddHeader} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Header
                    </Button>
                  )}

                  <Button
                    onClick={handleCloseModal}
                    className="bg-slate-700 hover:bg-slate-800 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowHeader;
