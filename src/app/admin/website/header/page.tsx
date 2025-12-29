"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

/* ===== DEFAULT MENU ===== */
const defaultMenus = [
  {
    label: "Dashboard",
    href: "#",
    icon: <LayoutDashboard className="h-4 w-4" />,
    show: true,
    subMenu: [],
  },
  {
    label: "Pages",
    href: "#",
    icon: <FileText className="h-4 w-4" />,
    show: true,
    subMenu: [
      { label: "Add Page", href: "#" },
      { label: "All Pages", href: "#" },
    ],
  },
];

export default function Page() {
  /* ===== STATE ===== */
  const [logoText, setLogoText] = useState("Admin CMS");
  const [menus, setMenus] = useState(defaultMenus);
  const [template, setTemplate] = useState<"light" | "dark">("light");

  const [showSearch, setShowSearch] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  /* ===== MENU FUNCTIONS ===== */
  const toggleSubMenu = (index: number) => setOpenSubMenu(openSubMenu === index ? null : index);

  const addMenu = () => setMenus([...menus, { label: "New Menu", href: "#", icon: <Settings className="h-4 w-4" />, show: true, subMenu: [] }]);
  const removeMenu = (index: number) => {
    const copy = [...menus];
    copy.splice(index, 1);
    setMenus(copy);
  };
  const addSubMenu = (index: number) => {
    const copy = [...menus];
    copy[index].subMenu.push({ label: "New Submenu", href: "#" });
    setMenus(copy);
  };
  const removeSubMenu = (menuIndex: number, subIndex: number) => {
    const copy = [...menus];
    copy[menuIndex].subMenu.splice(subIndex, 1);
    setMenus(copy);
  };
  const updateMenuLabel = (index: number, value: string) => {
    const copy = [...menus];
    copy[index].label = value;
    setMenus(copy);
  };
  const updateSubMenuLabel = (menuIndex: number, subIndex: number, value: string) => {
    const copy = [...menus];
    copy[menuIndex].subMenu[subIndex].label = value;
    setMenus(copy);
  };

  return (
    <div className={template === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-gray-100 min-h-screen"}>
      {/* HEADER */}
      <header className={template === "dark" ? "bg-gray-800 text-white shadow" : "bg-white text-gray-800 shadow"}>
        <div className="flex items-center justify-between px-6 py-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">
              {logoText.charAt(0)}
            </div>
            <input
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:outline-none text-lg font-semibold w-32"
            />
          </div>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 relative">
            {menus.filter((m) => m.show).map((menu, i) => (
              <div key={i} className="relative group">
                <button
                  className="flex items-center gap-1 text-sm hover:text-black focus:outline-none"
                  onClick={() => toggleSubMenu(i)}
                >
                  {menu.icon} {menu.label} {menu.subMenu.length > 0 && <ChevronDown className="h-3 w-3" />}
                </button>
                {menu.subMenu.length > 0 && openSubMenu === i && (
                  <div className="absolute top-8 left-0 bg-white border border-gray-200 shadow-lg rounded-md py-1 min-w-[160px] z-50">
                    {menu.subMenu.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center px-2 hover:bg-gray-50">
                        <Link href={sub.href} className="block py-1 text-sm text-gray-700">{sub.label}</Link>
                        <button onClick={() => removeSubMenu(i, idx)} className="p-1 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addSubMenu(i)} className="flex items-center gap-1 px-4 py-1 text-sm hover:bg-gray-100 w-full">
                      <Plus className="h-3 w-3" /> Add Submenu
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions with toggle options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded p-1 bg-gray-50 dark:bg-gray-700">
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={showSearch} onChange={() => setShowSearch(!showSearch)} /> Search
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={showNotification} onChange={() => setShowNotification(!showNotification)} /> Notif
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={showProfile} onChange={() => setShowProfile(!showProfile)} /> Profile
              </label>
            </div>

            {showSearch && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input placeholder="Search..." className="pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-black" />
              </div>
            )}
            {showNotification && (
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            {showProfile && (
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Yahan tum apna page <span className="bg-purple-700 text-white px-1 rounded">content</span> likh sakte ho.
        </p>

        {/* MENU EDITOR PANEL */}
        <div className="mt-6 p-4 bg-white rounded shadow space-y-3">
          <h2 className="text-lg font-semibold mb-2">Menu Editor</h2>
          <button onClick={addMenu} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded">
            <Plus className="h-3 w-3" /> Add Menu
          </button>
          {menus.map((menu, i) => (
            <div key={i} className="border p-2 rounded bg-gray-50 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  value={menu.label}
                  onChange={(e) => updateMenuLabel(i, e.target.value)}
                  className="border px-2 py-1 rounded w-40"
                />
                <button onClick={() => removeMenu(i)} className="p-1 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => addSubMenu(i)} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                  <Plus className="h-3 w-3" /> Add Submenu
                </button>
              </div>
              {menu.subMenu.length > 0 && (
                <div className="pl-4 space-y-1">
                  {menu.subMenu.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={sub.label}
                        onChange={(e) => updateSubMenuLabel(i, idx, e.target.value)}
                        className="border px-2 py-1 rounded w-36"
                      />
                      <button onClick={() => removeSubMenu(i, idx)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
