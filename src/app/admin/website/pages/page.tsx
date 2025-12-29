"use client";

import React from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function Page() {
  const posts = [
    {
      id: 1,
      title: "First Post",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus interdum.",
      author: "Admin",
      date: "Dec 29, 2025",
      thumbnail: "https://via.placeholder.com/400x200?text=Post+1",
    },
    {
      id: 2,
      title: "Second Post",
      excerpt: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Admin",
      date: "Dec 28, 2025",
      thumbnail: "https://via.placeholder.com/400x200?text=Post+2",
    },
    {
      id: 3,
      title: "Third Post",
      excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      author: "Editor",
      date: "Dec 27, 2025",
      thumbnail: "https://via.placeholder.com/400x200?text=Post+3",
    },
    {
      id: 4,
      title: "Fourth Post",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
      author: "Admin",
      date: "Dec 26, 2025",
      thumbnail: "https://via.placeholder.com/400x200?text=Post+4",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add New Post
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition flex flex-col overflow-hidden"
          >
            {/* Thumbnail */}
            <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-4 flex-1">{post.excerpt}</p>
              
              {/* Meta */}
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>By {post.author}</span>
                <span>{post.date}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-1 text-sm">
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <button className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-1 text-sm">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
