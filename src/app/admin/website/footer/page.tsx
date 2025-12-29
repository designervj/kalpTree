"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function Page() {
  /* ================= STATES ================= */

  // Branding
  const [brand, setBrand] = useState("AdminCMS");
  const [about, setAbout] = useState(
    "A modern CMS platform to manage content with clean UI."
  );

  // Menu Links
  const [links, setLinks] = useState([
    "Dashboard",
    "Posts",
    "Pages",
    "Settings",
  ]);

  // Contact Info
  const [address, setAddress] = useState("Jaipur, Rajasthan, India");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("support@admincms.com");

  // Social Toggles
  const [showFacebook, setShowFacebook] = useState(true);
  const [showTwitter, setShowTwitter] = useState(true);
  const [showInstagram, setShowInstagram] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);

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

      {/* ================= EDIT PANEL ================= */}
      <div className="bg-white border-b p-6">
        <h2 className="text-2xl font-bold mb-6">
          Footer Editor (Live)
        </h2>

        {/* Brand */}
        <div className="mb-4">
          <label className="text-sm font-semibold">Brand Name</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        {/* About */}
        <div className="mb-4">
          <label className="text-sm font-semibold">About Text</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        {/* Contact Info */}
        <div className="mb-6 grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Mobile Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Menu Links */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold">Footer Menu</label>
            <button
              onClick={addLink}
              className="flex items-center gap-1 text-sm bg-green-600 text-white px-2 py-1 rounded"
            >
              <Plus className="h-4 w-4" /> Add Link
            </button>
          </div>

          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={link}
                  onChange={(e) => updateLink(i, e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={() => removeLink(i)}
                  className="text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Toggles */}
        <div>
          <label className="text-sm font-semibold block mb-2">
            Social Icons
          </label>
          <div className="flex flex-wrap gap-4 text-sm">
            <label><input type="checkbox" checked={showFacebook} onChange={() => setShowFacebook(!showFacebook)} /> Facebook</label>
            <label><input type="checkbox" checked={showTwitter} onChange={() => setShowTwitter(!showTwitter)} /> Twitter</label>
            <label><input type="checkbox" checked={showInstagram} onChange={() => setShowInstagram(!showInstagram)} /> Instagram</label>
            <label><input type="checkbox" checked={showLinkedin} onChange={() => setShowLinkedin(!showLinkedin)} /> Linkedin</label>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {brand}
            </h2>
            <p className="text-sm text-gray-400">
              {about}
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Menu</h3>
            <ul className="space-y-2 text-sm">
              {links.map((l, i) => (
                <li key={i} className="hover:text-white cursor-pointer">
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin size={16} /> {address}
              </li>
              <li className="flex gap-2">
                <Phone size={16} /> {phone}
              </li>
              <li className="flex gap-2">
                <Mail size={16} /> {email}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {showFacebook && <Facebook />}
              {showTwitter && <Twitter />}
              {showInstagram && <Instagram />}
              {showLinkedin && <Linkedin />}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 text-center py-4 text-sm text-gray-400">
          © 2025 {brand}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
