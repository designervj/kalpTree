"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Tag, Grid, List, Plus, X } from "lucide-react";
import { Media } from "@/modules/website/types";

export default function MediaGalleryCMS() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/media");
      const json = await res.json();
      console.log(json);
      setMediaItems(json.items);
    })();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const res = await fetch(
        `/api/media/s3upload?fileType=${file.type}&fileName=${file.name}`
      );
      const { uploadUrl, fileUrl } = await res.json();

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      setPreview(fileUrl);
      setNewMedia({ ...newMedia, url: fileUrl });
    } catch (error) {
      console.error(`${error} in uploading media`);
    } finally {
      setUploadLoading(false);
    }
  };

  const [newMedia, setNewMedia] = useState({
    name: "",
    url: "",
    category: "",
    tags: "",
    tenantId: "",
    websiteId: "",
  });

  const categories = useMemo(() => {
    const cats = [...new Set(mediaItems.map((item) => item.category))];
    return ["all", ...cats];
  }, [mediaItems]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mediaItems.forEach((item) => {
      if (item.tags && typeof item.tags !== "string") {
        item?.tags?.forEach((t: any) => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [mediaItems]);

  console.log(categories, allTags);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch = item.name
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => item?.tags?.includes(tag));
      allTags;
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [mediaItems, searchTerm, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddMedia = async () => {
    if (newMedia.name && newMedia.url && newMedia.category) {
      setSubmitLoading(true);

      const finalObj = {
        name: newMedia.name,
        url: newMedia.url,
        category: newMedia.category,
        tags: newMedia.tags,
      };

      const res = await fetch("/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalObj),
      });

      // const {items} = await res.json()

      // const tags = newMedia.tags
      //   .split(",")
      //   .map((tag) => tag.trim())
      //   .filter(Boolean);

      setNewMedia({
        name: "",
        url: "",
        category: "",
        tags: "",
        tenantId: "",
        websiteId: "",
      });
      setPreview(null);
      setSubmitLoading(false);
      setShowAddModal(false);
    }
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems(mediaItems.filter((item) => String(item._id) !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 pt-1">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Add Media
            </button>
          </div>

          {/* --- SEARCH BAR --- */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* --- FILTERS --- */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <Grid size={20} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Tag filter */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Filter by tags:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- MEDIA LIST / GRID --- */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={String(item._id)}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => handleDeleteMedia(String(item._id))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {item.url}
                  </p>

                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {item.category}
                  </span>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {typeof item.tags !== "string" &&
                      item?.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredMedia.map((item) => (
              <div
                key={String(item._id)}
                className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{item.url}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {item.category}
                    </span>

                    {typeof item.tags !== "string" &&
                      item?.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMedia(String(item._id))}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredMedia.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">No media items found.</p>
          </div>
        )}
      </div>

      {/* --- ADD MEDIA MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Media</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Inputs */}
              <input
                type="text"
                placeholder="Name"
                value={newMedia.name}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, name: e.target.value })
                }
                disabled={uploadLoading}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploadLoading}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {uploadLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {preview && (
                <div className="w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="Category"
                value={newMedia.category}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, category: e.target.value })
                }
                disabled={uploadLoading}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <input
                type="text"
                placeholder="Tags, comma separated"
                value={newMedia.tags}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, tags: e.target.value })
                }
                disabled={uploadLoading}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                onClick={handleAddMedia}
                disabled={uploadLoading || submitLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  "Add Media"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
