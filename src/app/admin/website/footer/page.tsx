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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type TemplateKey = "classic" | "modern" | "minimal" | "newsletter";

/* =========================================================
   FOOTER TEMPLATES (Theme-variable based)
   Uses CSS vars from your theme system:
   --background, --foreground, --card, --muted, --muted-foreground,
   --border, --primary, --primary-foreground, --accent, --accent-foreground
========================================================= */
const FOOTER_TEMPLATES: Record<
  TemplateKey,
  {
    name: string;
    desc: string;
    container: string;
    grid: string;
    brandWrap: string;
    title: string;
    text: string;
    sectionTitle: string;
    link: string;
    iconWrap: string;
    bottomBar: string;
    newsletterWrap?: string;
    newsletterInput?: string;
    newsletterBtn?: string;
  }
> = {
  classic: {
    name: "Classic 4 Column",
    desc: "Grid footer with balanced columns.",
    container:
      "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-lg overflow-hidden",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10",
    brandWrap: "",
    title: "text-2xl font-bold text-[hsl(var(--foreground))] mb-3",
    text: "text-sm text-[hsl(var(--muted-foreground))]",
    sectionTitle: "text-lg font-semibold text-[hsl(var(--foreground))] mb-3",
    link: "text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] cursor-pointer transition-colors",
    iconWrap: "flex gap-4 text-[hsl(var(--muted-foreground))]",
    bottomBar:
      "border-t border-[hsl(var(--border))] text-center py-4 text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]",
  },

  modern: {
    name: "Modern Split",
    desc: "Brand left, links and contact right.",
    container:
      "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-lg overflow-hidden",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10",
    brandWrap: "lg:col-span-5",
    title: "text-3xl font-semibold text-[hsl(var(--foreground))] mb-3",
    text: "text-sm text-[hsl(var(--muted-foreground))] leading-relaxed",
    sectionTitle: "text-base font-semibold text-[hsl(var(--foreground))] mb-3",
    link: "text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] cursor-pointer transition-colors",
    iconWrap: "flex gap-3 text-[hsl(var(--muted-foreground))]",
    bottomBar:
      "border-t border-[hsl(var(--border))] text-center py-4 text-sm text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]",
  },

  minimal: {
    name: "Minimal Centered",
    desc: "Centered footer with compact links and social icons.",
    container:
      "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-lg overflow-hidden",
    grid: "max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-6",
    brandWrap: "",
    title: "text-xl font-bold text-[hsl(var(--foreground))]",
    text: "text-sm text-[hsl(var(--muted-foreground))] text-center max-w-xl",
    sectionTitle: "hidden",
    link: "text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] cursor-pointer transition-colors",
    iconWrap: "flex gap-4 text-[hsl(var(--muted-foreground))]",
    bottomBar:
      "border-t border-[hsl(var(--border))] text-center py-4 text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]",
  },

  newsletter: {
    name: "Newsletter + Links",
    desc: "Newsletter CTA strip plus footer content.",
    container:
      "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] rounded-lg overflow-hidden",
    grid: "max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10",
    brandWrap: "",
    title: "text-2xl font-semibold text-[hsl(var(--foreground))]",
    text: "text-sm text-[hsl(var(--muted-foreground))]",
    sectionTitle: "text-base font-semibold text-[hsl(var(--foreground))] mb-3",
    link: "text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] cursor-pointer transition-colors",
    iconWrap: "flex gap-3 text-[hsl(var(--muted-foreground))]",
    bottomBar:
      "border-t border-[hsl(var(--border))] text-center py-4 text-sm text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]",

    newsletterWrap:
      "rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4",
    newsletterInput:
      "w-full md:w-64 rounded-md px-3 py-2 bg-[hsl(var(--background))] border border-[hsl(var(--input))] text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]",
    newsletterBtn:
      "rounded-md px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 transition",
  },
};

export default function Page() {
  const [templateKey, setTemplateKey] = useState<TemplateKey>("classic");

  const [brand, setBrand] = useState("AdminCMS");
  const [about, setAbout] = useState(
    "A modern CMS platform to manage content with clean UI."
  );

  const [links, setLinks] = useState(["Dashboard", "Posts", "Pages", "Settings"]);

  const [address, setAddress] = useState("Jaipur, Rajasthan, India");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("support@admincms.com");

  const [showFacebook, setShowFacebook] = useState(true);
  const [showTwitter, setShowTwitter] = useState(true);
  const [showInstagram, setShowInstagram] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);

  const [newsletterTitle, setNewsletterTitle] = useState("Stay in the loop");
  const [newsletterDesc, setNewsletterDesc] = useState(
    "Get product updates, tips and announcements."
  );

  const tmpl = useMemo(() => FOOTER_TEMPLATES[templateKey], [templateKey]);

  const addLink = () => setLinks((prev) => [...prev, "New Link"]);

  const updateLink = (i: number, value: string) => {
    setLinks((prev) => {
      const copy = [...prev];
      copy[i] = value;
      return copy;
    });
  };

  const removeLink = (i: number) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="min-h-screen p-6 pt-2 flex flex-col">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="mb-6">
          <BreadCrumbPage />
          {/* <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">
            Footer
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Template select karo aur fields edit karo — footer live update hoga.
          </p> */}
        </div>

        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-black" />
          <Select
            value={templateKey}
            onValueChange={(v) => setTemplateKey(v as TemplateKey)}
          >
            <SelectTrigger className="w-[240px] rounded-md bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
              {Object.entries(FOOTER_TEMPLATES).map(([key, t]) => (
                <SelectItem key={key} value={key}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="px-0 pb-6">
        <Card className="rounded-md p-5 bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--card-foreground))] shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[hsl(var(--foreground))]">Brand Name</Label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded-md bg-[hsl(var(--background))] border-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[hsl(var(--foreground))]">About Text</Label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="rounded-md bg-[hsl(var(--background))] border-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                  rows={4}
                />
              </div>

              {templateKey === "newsletter" && (
                <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[hsl(var(--foreground))]">
                      Newsletter Section
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-full border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                    >
                      template
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">CTA Title</Label>
                    <Input
                      value={newsletterTitle}
                      onChange={(e) => setNewsletterTitle(e.target.value)}
                      className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      CTA Description
                    </Label>
                    <Textarea
                      value={newsletterDesc}
                      onChange={(e) => setNewsletterDesc(e.target.value)}
                      className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-5">
              {/* Contact */}
              <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
                <h3 className="font-semibold mb-3 text-[hsl(var(--foreground))]">
                  Contact Info
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[hsl(var(--foreground))]">Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Mobile Number</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Menu */}
              <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-[hsl(var(--foreground))]">
                    Footer Menu
                  </h3>
                  <Button
                    onClick={addLink}
                    className="rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                </div>

                <div className="space-y-2">
                  {links.map((link, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) => updateLink(i, e.target.value)}
                        className="rounded-md bg-[hsl(var(--card))] border-[hsl(var(--input))] text-[hsl(var(--foreground))]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
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
              <div className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
                <h3 className="font-semibold mb-3 text-[hsl(var(--foreground))]">
                  Social Icons
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-[hsl(var(--foreground))]">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showFacebook}
                      onChange={() => setShowFacebook(!showFacebook)}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Facebook
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showTwitter}
                      onChange={() => setShowTwitter(!showTwitter)}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Twitter
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showInstagram}
                      onChange={() => setShowInstagram(!showInstagram)}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Instagram
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showLinkedin}
                      onChange={() => setShowLinkedin(!showLinkedin)}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Linkedin
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Footer Preview */}
      <footer className={tmpl.container + " mt-auto"}>
        {/* Newsletter strip */}
        {templateKey === "newsletter" && (
          <div className="max-w-7xl mx-auto px-6 pt-10">
            <div className={tmpl.newsletterWrap}>
              <div>
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  {newsletterTitle}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  {newsletterDesc}
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  className={tmpl.newsletterInput}
                  placeholder="Enter your email"
                />
                <button className={tmpl.newsletterBtn}>Subscribe</button>
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

          {/* Non-minimal templates */}
          {templateKey !== "minimal" && (
            <>
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

              <div className={templateKey === "modern" ? "lg:col-span-4" : ""}>
                <h3 className={tmpl.sectionTitle}>Contact</h3>
                <ul className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
                  <li className="flex gap-2 items-start">
                    <MapPin size={16} className="mt-0.5 text-[hsl(var(--primary))]" />
                    <span>{address}</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Phone size={16} className="mt-0.5 text-[hsl(var(--primary))]" />
                    <span>{phone}</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Mail size={16} className="mt-0.5 text-[hsl(var(--primary))]" />
                    <span>{email}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={tmpl.sectionTitle}>Follow Us</h3>
                <div className={tmpl.iconWrap}>
                  {showFacebook && (
                    <Facebook className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                  )}
                  {showTwitter && (
                    <Twitter className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                  )}
                  {showInstagram && (
                    <Instagram className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                  )}
                  {showLinkedin && (
                    <Linkedin className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Minimal template */}
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
                {showFacebook && (
                  <Facebook className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                )}
                {showTwitter && (
                  <Twitter className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                )}
                {showInstagram && (
                  <Instagram className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                )}
                {showLinkedin && (
                  <Linkedin className="h-5 w-5 hover:text-[hsl(var(--primary))] cursor-pointer transition-colors" />
                )}
              </div>
            </>
          )}
        </div>

        <div className={tmpl.bottomBar}>© 2025 {brand}. All rights reserved.</div>
      </footer>
    </div>
  );
}