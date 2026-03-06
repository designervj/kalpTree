"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyUserComp({ userid }: any) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Simulate API call - replace with your actual API endpoint
      const res = await fetch(`/api/users/createwithemail?id=${userid}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.message == "User Verified Successfully") {
        router.push("/auth/signin");
      } else {
        setMessage(json.message);
      }

      // Reset form after successful submission
      setFormData({ name: "", password: "" });
    } catch (error) {
      setMessage("Error verifying user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Verify User</h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${message.includes("Error") || message.includes("Please fill")
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
