"use client";

import * as React from "react";
import {
  Plus,
  Search,
  FileText,
  Settings2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

type JobStatus = "queued" | "running" | "completed" | "failed";

type CatalogJob = {
  id: string;
  name: string;
  template: "Classic" | "Modern" | "Minimal";
  format: "PDF" | "HTML";
  createdAt: string;
  status: JobStatus;
  progress: number; // 0..100
  notes?: string;
};

const jobsSeed: CatalogJob[] = [
  {
    id: "cat-301",
    name: "Roofing Products — Feb",
    template: "Modern",
    format: "PDF",
    createdAt: "2026-02-02 10:14",
    status: "completed",
    progress: 100,
  },
  {
    id: "cat-302",
    name: "Paint Collection — Q1",
    template: "Classic",
    format: "HTML",
    createdAt: "2026-02-04 16:08",
    status: "running",
    progress: 62,
    notes: "Generating images & pricing blocks",
  },
  {
    id: "cat-303",
    name: "Siding Catalog — Dealers",
    template: "Minimal",
    format: "PDF",
    createdAt: "2026-02-04 18:21",
    status: "queued",
    progress: 0,
  },
  {
    id: "cat-304",
    name: "Tile Collection — Export",
    template: "Modern",
    format: "PDF",
    createdAt: "2026-01-28 09:01",
    status: "failed",
    progress: 30,
    notes: "Image pipeline timeout (sample)",
  },
];

function chip(status: JobStatus) {
  if (status === "completed")
    return (
      <Badge className="bg-emerald-600">
        <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
      </Badge>
    );
  if (status === "running")
    return (
      <Badge className="bg-blue-600">
        <RefreshCw className="mr-1 h-3 w-3" /> Running
      </Badge>
    );
  if (status === "queued")
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" /> Queued
      </Badge>
    );
  return (
    <Badge variant="destructive">
      <AlertTriangle className="mr-1 h-3 w-3" /> Failed
    </Badge>
  );
}

function progressBar(pct: number) {
  const v = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div className="h-2 rounded-full bg-foreground" style={{ width: `${v}%` }} />
    </div>
  );
}

export default function CatalogGenerationPage() {
  const [jobs, setJobs] = React.useState<CatalogJob[]>(jobsSeed);
  const [q, setQ] = React.useState("");
  const [format, setFormat] = React.useState<string>("all");
  const [template, setTemplate] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    return jobs.filter((j) => {
      const matchesQ =
        !q.trim() ||
        j.name.toLowerCase().includes(q.toLowerCase()) ||
        j.id.toLowerCase().includes(q.toLowerCase());
      const matchesFormat = format === "all" ? true : j.format === format;
      const matchesTemplate = template === "all" ? true : j.template === template;
      return matchesQ && matchesFormat && matchesTemplate;
    });
  }, [jobs, q, format, template]);

  return (
    <div className="min-h-screen px-3 pt-1">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* <div>
            <p className="text-sm text-muted-foreground">Marketing / Catalog Generation</p>
            <h1 className="text-3xl font-semibold tracking-tight">Catalog Generation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate product catalogs using templates. Track jobs, logs and outputs.
            </p>
          </div> */}

          <div>
            <BreadCrumbPage />
            <p className="mt-1 text-sm text-muted-foreground">
              Generate product catalogs using templates. Track jobs, logs and outputs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings2 className="mr-2 h-4 w-4" />
              Templates
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Catalog
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[760px]">
                <DialogHeader>
                  <DialogTitle>Create catalog job</DialogTitle>
                  <DialogDescription>
                    Select template, format and product filters. (UI-only sample)
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Catalog name</Label>
                    <Input placeholder="e.g., March Dealer Catalog" />
                  </div>

                  <div className="grid gap-2">
                    <Label>Template</Label>
                    <Select defaultValue="Modern">
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Classic", "Modern", "Minimal"].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Format</Label>
                    <Select defaultValue="PDF">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {["PDF", "HTML"].map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 rounded-xl border bg-muted/30 p-4">
                    <p className="text-sm font-medium">Filters (design only)</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Example: Category, Brand, Price range, Stock only, Featured only.
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <Input placeholder="Category contains..." />
                      <Input placeholder="Brand contains..." />
                      <Input placeholder="Price range..." />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      const next: CatalogJob = {
                        id: `cat-${Math.floor(Math.random() * 900 + 100)}`,
                        name: "New Catalog Job (UI)",
                        template: "Modern",
                        format: "PDF",
                        createdAt: "2026-02-05 11:00",
                        status: "queued",
                        progress: 0,
                      };
                      setJobs((p) => [next, ...p]);
                    }}
                  >
                    Create Job
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name or job id..."
                    className="pl-8"
                  />
                </div>

                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All templates</SelectItem>
                    {["Classic", "Modern", "Minimal"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    {["PDF", "HTML"].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline">View Logs</Button>
                <Button variant="outline">Queue Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs */}
        <div className="mt-6 grid gap-4">
          {filtered.map((j) => (
            <Card key={j.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{j.name}</CardTitle>
                      {chip(j.status)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {j.id} • {j.template} • {j.format} • Created {j.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Output
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Re-run</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setJobs((p) => p.filter((x) => x.id !== j.id))}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-sm">{j.progress}%</p>
                    </div>
                    <div className="mt-2">{progressBar(j.progress)}</div>
                    {j.notes ? (
                      <p className="mt-2 text-xs text-muted-foreground">{j.notes}</p>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Job pipeline: fetch products → render blocks → export output.
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <p className="text-xs">Artifacts</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        Share Link
                      </Button>
                      <Button variant="outline" size="sm">
                        View Job JSON
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!filtered.length ? (
            <Card className="shadow-sm">
              <CardContent className="p-10 text-center">
                <p className="text-sm font-medium">No jobs found</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a new catalog generation job.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
