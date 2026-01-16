"use client";

import React, { useMemo, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  LayoutGrid,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type TemplateKey = "classic" | "modern" | "minimal" | "newsletter";

/* ================= FOOTER TEMPLATES ================= */
const FOOTER_TEMPLATES: Record<
  TemplateKey,
  {
    name: string;
    desc: string;
    container: string;
    footer: string;
    grid: string;
    brandWrap: string;
    title: string;
    text: string;
    sectionTitle: string;
    link: string;
    iconWrap: string;
    bottomBar: string;
  }
> = {
  classic: {
    name: "Classic 4 Column",
    desc: "Grid + dark footer (default style).",
    container: "bg-slate-900 text-gray-300",
    footer: "border-t border-slate-700",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10",
    brandWrap: "",
    title: "text-2xl font-bold text-white mb-3",
    text: "text-sm text-gray-400",
    sectionTitle: "text-lg font-semibold text-white mb-3",
    link: "text-sm hover:text-white cursor-pointer",
    iconWrap: "flex gap-4 text-gray-300",
    bottomBar:
      "border-t border-slate-700 text-center py-4 text-sm text-gray-400",
  },
  modern: {
    name: "Modern Split",
    desc: "Brand left, links + contact right, soft dark.",
    container: "bg-zinc-950 text-zinc-200",
    footer: "border-t border-zinc-800",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10",
    brandWrap: "lg:col-span-5",
    title: "text-3xl font-semibold text-white mb-3",
    text: "text-sm text-zinc-400 leading-relaxed",
    sectionTitle: "text-base font-semibold text-white mb-3",
    link: "text-sm text-zinc-300 hover:text-white cursor-pointer",
    iconWrap: "flex gap-3 text-zinc-300",
    bottomBar:
      "border-t border-zinc-800 text-center py-4 text-sm text-white",
  },
  minimal: {
    name: "Minimal Centered",
    desc: "Clean centered footer with compact links + icons.",
    container: "bg-white text-slate-800",
    footer: "border-t border-slate-200",
    grid: "max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-6",
    brandWrap: "",
    title: "text-xl font-bold",
    text: "text-sm text-slate-500 text-center max-w-xl",
    sectionTitle: "hidden",
    link: "text-sm text-slate-600 hover:text-slate-900 cursor-pointer",
    iconWrap: "flex gap-4 text-slate-700",
    bottomBar:
      "border-t border-slate-200 text-center py-4 text-sm text-slate-500",
  },
  newsletter: {
    name: "Newsletter + Links",
    desc: "CTA strip + 3 columns content.",
    container: "bg-slate-950 text-slate-200",
    footer: "border-t border-slate-800",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10",
    brandWrap: "",
    title: "text-2xl font-semibold text-white",
    text: "text-sm text-slate-400",
    sectionTitle: "text-base font-semibold text-white mb-3",
    link: "text-sm text-slate-300 hover:text-white cursor-pointer",
    iconWrap: "flex gap-3 text-slate-300",
    bottomBar:
      "border-t border-slate-800 text-center py-4 text-sm text-white",
  },
};

export default function Page() {
  /* ================= STATES ================= */

  // Template
  const [templateKey, setTemplateKey] = useState<TemplateKey>("classic");

  // Branding
  const [brand, setBrand] = useState("AdminCMS");
  const [about, setAbout] = useState(
    "A modern CMS platform to manage content with clean UI."
  );

  // Menu Links (label only - later href add kar denge)
  const [links, setLinks] = useState(["Dashboard", "Posts", "Pages", "Settings"]);

  // Contact Info
  const [address, setAddress] = useState("Jaipur, Rajasthan, India");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("support@admincms.com");

  // Social Toggles
  const [showFacebook, setShowFacebook] = useState(true);
  const [showTwitter, setShowTwitter] = useState(true);
  const [showInstagram, setShowInstagram] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);

  // Newsletter template state (optional)
  const [newsletterTitle, setNewsletterTitle] = useState("Stay in the loop");
  const [newsletterDesc, setNewsletterDesc] = useState(
    "Get product updates, tips and announcements."
  );

  const tmpl = useMemo(() => FOOTER_TEMPLATES[templateKey], [templateKey]);

  /* ================= FUNCTIONS ================= */
  const addLink = () => setLinks([...links, "New Link"]);

  const updateLink = (i: number, value: string) => {
    const copy = [...links];
    copy[i] = value;
    setLinks(copy);
  };

  const removeLink = (i: number) => {
    const copy = [...links];
    copy.splice(i, 1);
    setLinks(copy);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="mb-6">
        <BreadCrumbPage />
          <p className="text-sm text-muted-foreground">
           Template select karo aur fields edit karo — footer live update hoga.
          </p>
      </div>

        <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <Select value={templateKey} onValueChange={(v) => setTemplateKey(v as TemplateKey)}>
                <SelectTrigger className="w-[240px] rounded-md bg-white">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FOOTER_TEMPLATES).map(([key, t]) => (
                    <SelectItem key={key} value={key}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="rounded-md">
                {FOOTER_TEMPLATES[templateKey].desc}
              </Badge>
            </div>
</div>


      {/* ================= EDITOR PANEL ================= */}
      <div className="px-0 pb-6">
        <Card className="rounded-md p-5 bg-white">
          {/* <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Footer Editor</h2>
              <p className="text-sm text-muted-foreground">
                Template select karo aur fields edit karo — footer live update hoga.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <Select value={templateKey} onValueChange={(v) => setTemplateKey(v as TemplateKey)}>
                <SelectTrigger className="w-[240px] rounded-md">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FOOTER_TEMPLATES).map(([key, t]) => (
                    <SelectItem key={key} value={key}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="rounded-full">
                {FOOTER_TEMPLATES[templateKey].desc}
              </Badge>
            </div>
          </div> */}

          {/* <Separator className="my-5" /> */}

          {/* Form grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-md" />
              </div>

              {/* About */}
              <div className="space-y-2">
                <Label>About Text</Label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="rounded-md"
                  rows={4}
                />
              </div>

              {/* Newsletter (only show if template newsletter) */}
              {templateKey === "newsletter" && (
                <div className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Newsletter Section</p>
                    <Badge variant="outline" className="rounded-full">template</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>CTA Title</Label>
                    <Input
                      value={newsletterTitle}
                      onChange={(e) => setNewsletterTitle(e.target.value)}
                      className="rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA Description</Label>
                    <Textarea
                      value={newsletterDesc}
                      onChange={(e) => setNewsletterDesc(e.target.value)}
                      className="rounded-md"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* Contact */}
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-3">Contact Info</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md" />
                  </div>
                </div>
              </div>

              {/* Footer Menu */}
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold">Footer Menu</h3>
                  <Button onClick={addLink} className="rounded-md">
                    <Plus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                </div>

                <div className="space-y-2">
                  {links.map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) => updateLink(i, e.target.value)}
                        className="rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeLink(i)}
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Icons */}
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-3">Social Icons</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showFacebook} onChange={() => setShowFacebook(!showFacebook)} />
                    Facebook
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showTwitter} onChange={() => setShowTwitter(!showTwitter)} />
                    Twitter
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showInstagram} onChange={() => setShowInstagram(!showInstagram)} />
                    Instagram
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showLinkedin} onChange={() => setShowLinkedin(!showLinkedin)} />
                    Linkedin
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= LIVE FOOTER PREVIEW ================= */}
      <footer className={tmpl.container + " mt-auto"}>
        {/* Newsletter strip for newsletter template */}
        {templateKey === "newsletter" && (
          <div className="max-w-7xl mx-auto px-6 pt-10">
            <div className="rounded-md border border-slate-800 bg-slate-900/40 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{newsletterTitle}</h3>
                <p className="text-sm text-slate-400 mt-1">{newsletterDesc}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  className="w-full md:w-64 rounded-md px-3 py-2 bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
                  placeholder="Enter your email"
                />
                <button className="rounded-md px-4 py-2 bg-white text-slate-900 text-sm font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main footer */}
        <div className={tmpl.grid}>
          {/* Brand */}
          <div className={tmpl.brandWrap}>
            <h2 className={tmpl.title}>{brand}</h2>
            <p className={tmpl.text}>{about}</p>
          </div>

          {/* Classic / Modern / Newsletter content grid */}
          {templateKey !== "minimal" && (
            <>
              {/* Menu */}
              <div className={templateKey === "modern" ? "lg:col-span-3" : ""}>
                <h3 className={tmpl.sectionTitle}>Menu</h3>
                <ul className="space-y-2">
                  {links.map((l, i) => (
                    <li key={i} className={tmpl.link}>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className={templateKey === "modern" ? "lg:col-span-4" : ""}>
                <h3 className={tmpl.sectionTitle}>Contact</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 items-start">
                    <MapPin size={16} className="mt-0.5" /> {address}
                  </li>
                  <li className="flex gap-2 items-start">
                    <Phone size={16} className="mt-0.5" /> {phone}
                  </li>
                  <li className="flex gap-2 items-start">
                    <Mail size={16} className="mt-0.5" /> {email}
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className={tmpl.sectionTitle}>Follow Us</h3>
                <div className={tmpl.iconWrap}>
                  {showFacebook && <Facebook className="h-5 w-5 hover:text-white cursor-pointer" />}
                  {showTwitter && <Twitter className="h-5 w-5 hover:text-white cursor-pointer" />}
                  {showInstagram && <Instagram className="h-5 w-5 hover:text-white cursor-pointer" />}
                  {showLinkedin && <Linkedin className="h-5 w-5 hover:text-white cursor-pointer" />}
                </div>
              </div>
            </>
          )}

          {/* Minimal template layout */}
          {templateKey === "minimal" && (
            <>
              <div className="flex flex-wrap justify-center gap-6">
                {links.map((l, i) => (
                  <span key={i} className={tmpl.link}>
                    {l}
                  </span>
                ))}
              </div>

              <div className={tmpl.iconWrap}>
                {showFacebook && <Facebook className="h-5 w-5 hover:text-slate-900 cursor-pointer" />}
                {showTwitter && <Twitter className="h-5 w-5 hover:text-slate-900 cursor-pointer" />}
                {showInstagram && <Instagram className="h-5 w-5 hover:text-slate-900 cursor-pointer" />}
                {showLinkedin && <Linkedin className="h-5 w-5 hover:text-slate-900 cursor-pointer" />}
              </div>
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div className={tmpl.bottomBar}>© 2025 {brand}. All rights reserved.</div>
      </footer>
    </div>
  );
}
