"use client";

import * as React from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Download,
  Trash2,
  Mail,
  ArrowUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type FormTab = "subscribe" | "contact";
type Screen = "list" | "details";

export type FormRow = {
  id: string;
  name: string;
  submissions: number;
  type: FormTab;
};

export type SubmissionRow = {
  id: string;
  email: string;
  name: string;
  message: string;
  dateAdded: string; // e.g. "2026-01-30"
};

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

/* -----------------------------
   UI: Segmented tabs (List view)
------------------------------ */
function SegTab({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex-1 rounded-full px-6 py-3 text-base font-semibold transition",
        active
          ? "bg-white text-violet-600 shadow-sm"
          : "bg-transparent text-slate-900 hover:bg-white/70"
      )}
    >
      {children}
    </button>
  );
}

/* -----------------------------
   Row actions (List view)
   - View button
   - ... dropdown: Download CSV / Delete
------------------------------ */
function FormActions({
  onView,
  onDownloadCsv,
  onDelete,
}: {
  onView: () => void;
  onDownloadCsv: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onView}
        className="h-12 rounded-xl border-slate-200 px-6 text-base font-semibold text-violet-600 hover:bg-slate-50"
      >
        View <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 p-0 text-slate-700 hover:bg-slate-100"
            aria-label="More"
          >
            <MoreHorizontal className="mx-auto h-5 w-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
          <DropdownMenuItem
            className="h-12 rounded-lg text-base"
            onSelect={(e) => {
              e.preventDefault();
              onDownloadCsv();
            }}
          >
            <Download className="mr-3 h-5 w-5" />
            Download CSV
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="h-12 rounded-lg text-base text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="mr-3 h-5 w-5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* -----------------------------
   Demo data (replace with API)
------------------------------ */
const DEFAULT_SUBSCRIBE: FormRow[] = [
  { id: "s1", name: "Subscribe form 2", submissions: 0, type: "subscribe" },
  { id: "s2", name: "Subscribe form 1", submissions: 0, type: "subscribe" },
  { id: "s3", name: "Subscribe form", submissions: 0, type: "subscribe" },
];

const DEFAULT_CONTACT: FormRow[] = [
  { id: "c1", name: "Contact form 5", submissions: 0, type: "contact" },
  { id: "c2", name: "Contact form 4", submissions: 0, type: "contact" },
  { id: "c3", name: "Contact form 1", submissions: 0, type: "contact" },
  { id: "c4", name: "Contact form 3", submissions: 0, type: "contact" },
  { id: "c5", name: "Contact form", submissions: 0, type: "contact" },
  { id: "c6", name: "Contact form 2", submissions: 0, type: "contact" },
];

// per-form submissions (empty = show “No submissions just yet”)
const DEFAULT_SUBMISSIONS_BY_FORM: Record<string, SubmissionRow[]> = {
  // "c1": [{ id:"1", email:"a@b.com", name:"John", message:"Hello", dateAdded:"2026-01-30" }],
};

export default function FormSubmissionsModal({
  open = true,
  onClose,
  subscribeForms = DEFAULT_SUBSCRIBE,
  contactForms = DEFAULT_CONTACT,
  submissionsByForm = DEFAULT_SUBMISSIONS_BY_FORM,

  onDownloadCsv,
  onDeleteForm,
  onDeleteSubmissions,
}: {
  open?: boolean;
  onClose: () => void;

  subscribeForms?: FormRow[];
  contactForms?: FormRow[];
  submissionsByForm?: Record<string, SubmissionRow[]>;

  onDownloadCsv?: (form: FormRow) => void;
  onDeleteForm?: (form: FormRow) => void;
  onDeleteSubmissions?: (form: FormRow, submissionIds: string[]) => void;
}) {
  const [screen, setScreen] = React.useState<Screen>("list");
  const [tab, setTab] = React.useState<FormTab>("subscribe");
  const [activeForm, setActiveForm] = React.useState<FormRow | null>(null);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const subscribeCount = subscribeForms.length;
  const contactCount = contactForms.length;

  const listData = tab === "subscribe" ? subscribeForms : contactForms;

  const detailSubmissions = React.useMemo(() => {
    if (!activeForm) return [];
    return submissionsByForm?.[activeForm.id] ?? [];
  }, [activeForm, submissionsByForm]);

  React.useEffect(() => {
    // reset selection when switching screens/forms
    setSelectedIds(new Set());
  }, [screen, activeForm?.id]);

  if (!open) return null;

  const handleView = (form: FormRow) => {
    setActiveForm(form);
    setScreen("details");
  };

  const handleDownloadCsv = (form: FormRow) => {
    if (onDownloadCsv) return onDownloadCsv(form);
    console.log("Download CSV:", form);
  };

  const handleDeleteForm = (form: FormRow) => {
    if (onDeleteForm) return onDeleteForm(form);
    console.log("Delete form:", form);
  };

  const selectedCount = selectedIds.size;
  const allIds = detailSubmissions.map((s) => s.id);
  const allChecked = allIds.length > 0 && selectedCount === allIds.length;

  const toggleAll = (checked: boolean) => {
    if (!checked) return setSelectedIds(new Set());
    setSelectedIds(new Set(allIds));
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (!activeForm || selectedCount === 0) return;
    const ids = Array.from(selectedIds);
    if (onDeleteSubmissions) return onDeleteSubmissions(activeForm, ids);
    console.log("Delete submissions:", activeForm, ids);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="relative h-[75vh] w-[96vw] max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* =======================
            DETAILS SCREEN (2nd image)
            - hides Subscribe/Contact tabs
           ======================= */}
        {screen === "details" && activeForm ? (
          <div className="flex h-full flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-10 pt-6">
              <Button
                type="button"
                onClick={() => setScreen("list")}
                // className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Form header card */}
            <div className="px-10 pt-6">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/60 text-slate-700">
                    <Mail className="h-7 w-7" />
                  </div>

                  <div>
                    <div className="text-xl font-semibold text-slate-900">
                      {activeForm.name}
                    </div>
                    <div className="mt-1 text-lg text-slate-500">
                      {activeForm.submissions} Submissions
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleDownloadCsv(activeForm)}
                  className="h-12 rounded-xl border-slate-200 px-6 text-base font-semibold text-slate-700 hover:bg-white"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download CSV
                </Button>
              </div>
            </div>

            {/* Selected bar */}
            <div className="px-10 pt-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4">
                <div className="text-base text-slate-700">
                  Selected: <span className="font-semibold">{selectedCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={selectedCount === 0}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold",
                    selectedCount === 0
                      ? "text-slate-400"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 flex-1 overflow-y-auto px-10 pb-10">
              <div className="rounded-[3px] border border-slate-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100/70 ">
                      <TableHead className="w-[56px]">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(v) => toggleAll(Boolean(v))}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="text-base font-semibold text-slate-800">
                        Email
                      </TableHead>
                      <TableHead className="text-base font-semibold text-slate-800">
                        Name
                      </TableHead>
                      <TableHead className="text-base font-semibold text-slate-800">
                        Message
                      </TableHead>
                      <TableHead className="text-base font-semibold text-slate-800">
                        <span className="inline-flex items-center gap-2">
                          Date Added <ArrowUp className="h-4 w-4" />
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {detailSubmissions.map((s) => {
                      const checked = selectedIds.has(s.id);
                      return (
                        <TableRow key={s.id} className="hover:bg-slate-50/50">
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => toggleOne(s.id, Boolean(v))}
                              aria-label={`Select ${s.email}`}
                            />
                          </TableCell>
                          <TableCell className="text-base text-slate-800">
                            {s.email}
                          </TableCell>
                          <TableCell className="text-base text-slate-800">
                            {s.name}
                          </TableCell>
                          <TableCell className="text-base text-slate-800">
                            {s.message}
                          </TableCell>
                          <TableCell className="text-base text-slate-800">
                            {s.dateAdded}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Empty state */}
                {detailSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
                    <div className="text-2xl font-semibold text-slate-800">
                      No submissions just yet
                    </div>
                    <div className="mt-2 max-w-xl text-lg text-slate-500">
                      This forms submissions will appear here once someone fills it out.
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          /* =======================
             LIST SCREEN (1st image)
             - shows Subscribe/Contact segmented tabs
             - View opens details screen
           ======================= */
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-10 pt-8">
              <h2 className="text-[24px] font-semibold text-slate-900">
                Form submissions
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Segmented tabs */}
            <div className="mt-8 px-10">
              <div className="rounded-full bg-slate-100 p-2">
                <div className="flex items-center gap-2">
                  <SegTab active={tab === "subscribe"} onClick={() => setTab("subscribe")}>
                    Subscribe Forms ({subscribeCount})
                  </SegTab>
                  <SegTab active={tab === "contact"} onClick={() => setTab("contact")}>
                    Contact Forms ({contactCount})
                  </SegTab>
                </div>
              </div>
            </div>

            {/* Rows */}
            <div className="mt-6 flex-1 overflow-y-auto px-10 pb-10">
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                {listData.map((row) => (
                  <div key={row.id} className="flex items-center justify-between px-2 py-7">
                    <div className="pl-4">
                      <div className="text-xl font-semibold text-slate-900">
                        {row.name}
                      </div>
                      <div className="mt-1 text-md text-slate-500">
                        {row.submissions} Submissions
                      </div>
                    </div>

                    <div className="pr-4">
                      <FormActions
                        onView={() => handleView(row)}
                        onDownloadCsv={() => handleDownloadCsv(row)}
                        onDelete={() => handleDeleteForm(row)}
                      />
                    </div>
                  </div>
                ))}

                {listData.length === 0 ? (
                  <div className="py-20 text-center text-slate-500">
                    No forms found.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
