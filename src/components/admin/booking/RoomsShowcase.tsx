"use client";
import React, { useState } from "react";
import { Edit2, Plus, ChevronRight } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { buildWebsiteHref } from "@/lib/utils";

const RoomsRateplans = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Deluxe Double or Twin Room",
      description: "Deluxe Double or Twin Room",
      active: true,
      rateplans: ["Room Only", "Room Only Non-Refundable", "Breakfast"],
      hasMore: 1,
    },
    {
      id: 2,
      name: "Standard Double Bed Room",
      description: "",
      active: false,
      rateplans: [],
      hasMore: 0,
    },
    {
      id: 3,
      name: "Deluxe Twin Bed Room",
      description: "Deluxe Room",
      active: false,
      rateplans: [],
      hasMore: 0,
    },
    {
      id: 4,
      name: "$ Deluxe Room (Hourly)",
      description: "Deluxe Room",
      active: false,
      rateplans: [
        "dayuse rateplan 6hr",
        "dayuse rateplan 9hr",
        "dayuse rateplan 3hr",
      ],
      hasMore: 0,
      hasAmenities: true,
    },
    {
      id: 5,
      name: "Deluxe Room",
      description: "Deluxe Room",
      active: false,
      rateplans: ["Not in USE please dont activa...", "CPAI", "MAPAI"],
      hasMore: 3,
    },
  ]);

  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());
  console.log(searchparams);
  const router = useRouter();

  const handleEdit = (section) => {
    const href = buildWebsiteHref(
      `/admin/bookings/rooms-rate-plans/edit`,
      params.website!,
      { ...searchparams, editrooms: "1223" },
    );
    router.push(href);
  };

  const handleCreateRoom = () => {
    const href = buildWebsiteHref(
      `/admin/bookings/rooms-rate-plans/create`,
      params.website!,
      searchparams,
    );
    router.push(href);
  };

  const toggleActive = (id) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, active: !room.active } : room,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Rooms & Rateplans
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Preview :</span>
            <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-red-600 transition">
              MMT
            </button>
            <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-orange-600 transition">
              GO
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Subheader */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              Existing Rooms <span className="text-gray-500">(5)</span>
            </h2>
            <button
              onClick={handleCreateRoom}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              CREATE NEW ROOM
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                    Room Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                    Rateplans
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, index) => (
                  <tr
                    key={room.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                  >
                    {/* Room Name */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-gray-900">
                        {room.name}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-600">
                        {room.description || "-"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-3">
                        {/* Active Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={room.active}
                            onChange={() => toggleActive(room.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Active
                          </span>
                        </label>

                        {/* Edit Room Button */}
                        <button
                          onClick={() => handleEdit("section")}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                        >
                          <Edit2 className="w-4 h-4" />
                          EDIT ROOM
                        </button>

                        {/* Edit Amenities Button (conditional) */}
                        {room.hasAmenities && (
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition">
                            <Edit2 className="w-4 h-4" />
                            EDIT AMENITIES
                          </button>
                        )}

                        {/* Add Rateplan Button */}
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition">
                          <Plus className="w-4 h-4" />
                          ADD RATEPLAN
                        </button>
                      </div>
                    </td>

                    {/* Rateplans */}
                    <td className="px-6 py-5">
                      {room.rateplans.length > 0 ? (
                        <div className="space-y-2">
                          {room.rateplans.map((plan, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              <span className="font-medium text-gray-500">
                                {idx + 1}.
                              </span>{" "}
                              {plan}
                            </div>
                          ))}
                          {room.hasMore > 0 && (
                            <div className="text-sm text-gray-500">
                              + {room.hasMore} more
                            </div>
                          )}
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm mt-3 transition">
                            {room.hasAmenities
                              ? "CLICK TO VIEW DETAILS"
                              : "CLICK TO VIEW RATEPLANS"}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          No Rateplans Created
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Keep your room
            information and rateplans up to date to attract more bookings.
            Active rooms will be visible to guests on booking platforms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomsRateplans;
