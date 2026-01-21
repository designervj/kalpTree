"use client";

import React, { useState } from "react";
import { Edit2, X, Plus, Minus, ChevronDown } from "lucide-react";
import { buildWebsiteHref } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const HotelRoomManager = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: "Deluxe",
    roomView: "No View",
    roomSize: 10,
    roomSizeUnit: "Square Meter",
    roomName: "Deluxe Double or Twin Room",
    numberOfRooms: 21,
    description: "Deluxe Double or Twin Room",
    bedType: "Double Bed",
    numberOfBeds: 1,
    extraBeds: true,
    maxExtraBeds: 1,
    alternateArrangement: false,
    baseAdults: 2,
    maxAdults: 3,
    baseChildren: 2,
    maxChildren: 2,
    maxOccupancy: 4,
    bathrooms: 1,
    amenities: {
      bathtub: false,
      hairdryer: false,
      hotColdWater: false,
      toiletries: false,
      towels: false,
      tv: false,
      balcony: false,
      airConditioning: false,
      ironingBoard: false,
      mineralWater: false,
      kettle: false,
      wifi: false,
      safe: false,
      bathroom: false,
      peepHole: false,
    },
    photos: [
      "/api/placeholder/100/100",
      "/api/placeholder/100/100",
      "/api/placeholder/100/100",
      "/api/placeholder/100/100",
      "/api/placeholder/100/100",
    ],
  });

  const searchParams = useSearchParams();
  const params = useParams();
  const searchparams = Object.fromEntries(searchParams.entries());
  const router = useRouter();

  const handleEdit = (section) => {
    // const href = buildWebsiteHref(
    //   `/admin/bookings/rooms-rate-plans/edit`,
    //   params.website!,
    //   searchparams,
    // );
    // router.push(href);
  };

  const handleSave = () => {
    setEditingSection(null);
  };

  const updateField = (field, value) => {
    setRoomData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAmenity = (amenity, value) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: value },
    }));
  };

  const increment = (field) => {
    setRoomData((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrement = (field) => {
    setRoomData((prev) => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));
  };

  // Room Details Section
  const RoomDetailsView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Details</h2>
        <button
          onClick={() => handleEdit("roomDetails")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Room Name as shown on MakeMyTrip & its partner websites
          </p>
          <p className="font-semibold">{roomData.roomName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Room view</p>
          <p className="font-semibold">{roomData.roomView}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Number of rooms (of this type)
          </p>
          <p className="font-semibold">{roomData.numberOfRooms}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Room Size</p>
          <p className="font-semibold">
            {roomData.roomSize} {roomData.roomSizeUnit}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-1">Description of the room</p>
        <p className="font-semibold">{roomData.description}</p>
      </div>
    </div>
  );

  const RoomDetailsEdit = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Room Details</h2>
        <p className="text-sm text-gray-600">
          Add the name and key features of this room type
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Room type</label>
          <p className="text-sm text-gray-600 mb-2">
            Choose the type that best describes this room
          </p>
          <select
            value={roomData.roomType}
            onChange={(e) => updateField("roomType", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option>Deluxe</option>
            <option>Standard</option>
            <option>Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Room view</label>
          <p className="text-sm text-gray-600 mb-2">
            Describe what the guest will see from this room, like pool, garden,
            or city views.
          </p>
          <select
            value={roomData.roomView}
            onChange={(e) => updateField("roomView", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option>No View</option>
            <option>City View</option>
            <option>Garden View</option>
            <option>Pool View</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Room Size (Area)
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Specify the indoor area of the room in square units, exclude shared
            spaces
          </p>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={roomData.roomSizeUnit === "Square Feet"}
                onChange={() => updateField("roomSizeUnit", "Square Feet")}
                className="mr-2"
              />
              Square Feet
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={roomData.roomSizeUnit === "Square Meter"}
                onChange={() => updateField("roomSizeUnit", "Square Meter")}
                className="mr-2"
              />
              Square Meter
            </label>
            <input
              type="number"
              value={roomData.roomSize}
              onChange={(e) =>
                updateField("roomSize", parseInt(e.target.value))
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Room Name as shown on MakeMyTrip & its partner websites
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Add a room name that looks attractive to travellers
          </p>
          <input
            type="text"
            value={roomData.roomName}
            onChange={(e) => updateField("roomName", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Number of rooms (of this type)
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Specify how many rooms of this type are at your property
          </p>
          <input
            type="number"
            value={roomData.numberOfRooms}
            onChange={(e) =>
              updateField("numberOfRooms", parseInt(e.target.value))
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Description of the room (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Highlight what makes this room appealing — its view, comfort, and
            key features.
          </p>
          <ul className="text-sm text-gray-600 mb-2 ml-4 list-disc">
            <li>Highlight what makes the room special</li>
            <li>Describe what can be seen from the room</li>
            <li>List the features and services provided</li>
          </ul>
          <textarea
            value={roomData.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-32"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingSection(null)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Sleeping Arrangement Section
  const SleepingArrangementView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sleeping Arrangement & Occupancy</h2>
        <button
          onClick={() => handleEdit("sleeping")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            Beds available in the room
          </p>
          <p className="font-semibold">
            {roomData.numberOfBeds} {roomData.bedType}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Maximum Occupancy</p>
          <p className="font-semibold">{roomData.maxOccupancy}</p>
        </div>
      </div>
    </div>
  );

  const SleepingArrangementEdit = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Sleeping Arrangement & Occupancy
        </h2>
        <p className="text-sm text-gray-600">
          Select bed types and how many guests this room can host
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4">Standard Arrangement</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Select the types of beds available in this room
            </label>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1">
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <div className="w-5 h-3 bg-blue-600 rounded"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600">Double Bed</p>
                      <p className="text-sm text-gray-600">5 feet by 6 feet</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("numberOfBeds")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.numberOfBeds}
                </span>
                <button
                  onClick={() => increment("numberOfBeds")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Add Another Bed Type
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Can this room accommodate extra bed(s)?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!roomData.extraBeds}
                  onChange={() => updateField("extraBeds", false)}
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={roomData.extraBeds}
                  onChange={() => updateField("extraBeds", true)}
                  className="mr-2"
                />
                Yes
              </label>
            </div>
            {roomData.extraBeds && (
              <div className="mt-4">
                <label className="block text-sm mb-2">
                  What is the maximum number of extra bed(s) that can be
                  accommodated in this room?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement("maxExtraBeds")}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {roomData.maxExtraBeds}
                  </span>
                  <button
                    onClick={() => increment("maxExtraBeds")}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">
            Alternative Sleeping Arrangement (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If the standard sleeping arrangement isn't available, the guest will
            get one of the alternative bed options below
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Does this room offer an alternate sleeping arrangement?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!roomData.alternateArrangement}
                  onChange={() => updateField("alternateArrangement", false)}
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={roomData.alternateArrangement}
                  onChange={() => updateField("alternateArrangement", true)}
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Occupancy</h3>
          <p className="text-sm text-gray-600 mb-4">
            Occupancy details have been pre-filled based on the selected bed
            arrangement above
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Base adults</p>
                <p className="text-sm text-gray-600">
                  Ideal number of adults supported by the standard sleeping
                  arrangement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("baseAdults")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.baseAdults}
                </span>
                <button
                  onClick={() => increment("baseAdults")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Maximum adults</p>
                <p className="text-sm text-gray-600">
                  Maximum number of adults that can be accommodated in this
                  room.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("maxAdults")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.maxAdults}
                </span>
                <button
                  onClick={() => increment("maxAdults")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Base children</p>
                <p className="text-sm text-gray-600">
                  Maximum number of free children that can be accommodated in
                  this room.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("baseChildren")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.baseChildren}
                </span>
                <button
                  onClick={() => increment("baseChildren")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Maximum children</p>
                <p className="text-sm text-gray-600">
                  Maximum number of children that can be accommodated in this
                  room.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("maxChildren")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.maxChildren}
                </span>
                <button
                  onClick={() => increment("maxChildren")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Child Age Policy
            </button>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Maximum occupancy</p>
                <p className="text-sm text-gray-600">
                  Maximum number of guests that can be accommodated in this
                  room.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement("maxOccupancy")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {roomData.maxOccupancy}
                </span>
                <button
                  onClick={() => increment("maxOccupancy")}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingSection(null)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Bathroom Details Section
  const BathroomDetailsView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bathroom Details</h2>
        <button
          onClick={() => handleEdit("bathroom")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Bathroom available</p>
        <p className="font-semibold">{roomData.bathrooms}</p>
      </div>
    </div>
  );

  const BathroomDetailsEdit = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Bathroom Details</h2>
        <p className="text-sm text-gray-600">
          Add details of bathroom(s) for this room type
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Specify number of bathroom(s) available
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => decrement("bathrooms")}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold">
            {roomData.bathrooms}
          </span>
          <button
            onClick={() => increment("bathrooms")}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingSection(null)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Amenity Details Section
  const AmenityDetailsView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Amenity Details</h2>
        <button
          onClick={() => handleEdit("amenities")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">Amenities added</p>
        <p className="font-semibold">88 amenities</p>
      </div>
    </div>
  );

  const AmenityItem = ({ label, name }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <span className="text-sm">{label}</span>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={!roomData.amenities[name]}
            onChange={() => updateAmenity(name, false)}
            className="mr-2"
          />
          No
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={roomData.amenities[name]}
            onChange={() => updateAmenity(name, true)}
            className="mr-2"
          />
          Yes
        </label>
      </div>
    </div>
  );

  const AmenityDetailsEdit = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Amenity Details</h2>
        <p className="text-sm text-gray-600">
          Select the amenities available in this room to help travellers know
          what to expect during their stay
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search amenities"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Mandatory
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              i
            </span>
          </h3>
          <AmenityItem label="Bathtub" name="bathtub" />
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Popular with Guests
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              i
            </span>
          </h3>
          <AmenityItem label="Hairdryer" name="hairdryer" />
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Bathroom
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              i
            </span>
          </h3>
          <AmenityItem label="Hot & Cold Water" name="hotColdWater" />
          <AmenityItem label="Toiletries" name="toiletries" />
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Room Features
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              i
            </span>
          </h3>
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Media and Entertainment
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              i
            </span>
          </h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Food and Drinks</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            Kitchen and Appliances
            <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
              ?
            </span>
          </h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Beds and Blanket</h3>
          <AmenityItem label="Towels" name="towels" />
        </div>

        <div>
          <h3 className="font-bold mb-2">Safety and Security</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Childcare</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Other Facilities</h3>
          <AmenityItem label="TV" name="tv" />
          <AmenityItem label="Balcony" name="balcony" />
          <AmenityItem label="Air Conditioning" name="airConditioning" />
          <AmenityItem label="Iron/Ironing Board" name="ironingBoard" />
          <AmenityItem label="Mineral Water" name="mineralWater" />
          <AmenityItem label="Kettle" name="kettle" />
          <AmenityItem label="WiFi" name="wifi" />
          <AmenityItem label="Safe" name="safe" />
          <AmenityItem label="Bathroom" name="bathroom" />
          <AmenityItem label="Peep Hole" name="peepHole" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingSection(null)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Photos & Videos Section
  const PhotosVideosView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Photos & Videos</h2>
        <button
          onClick={() => handleEdit("photos")}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="flex gap-3">
        {roomData.photos.map((photo, index) => (
          <div
            key={index}
            className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={photo}
              alt={`Room ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const PhotosVideosEdit = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Photos & Videos</h2>
        <p className="text-sm text-gray-600">
          Add/Select high-quality images of the room and bathroom to help guests
          choose with confidence
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Add/Select photos and videos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ensure at least 2 images of the room and 1 of the bathroom are
          uploaded.
        </p>

        <div className="flex gap-3 mb-4">
          {roomData.photos.map((photo, index) => (
            <div
              key={index}
              className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden relative"
            >
              <img
                src={photo}
                alt={`Room ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm">
            Do you want to add more photos or videos for this room?
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload More
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => setEditingSection(null)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <span className="text-gray-600">Property Info</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-blue-600">Rooms</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">Deluxe Double or Twin Room</h1>

        {/* Sections */}
        {editingSection === "roomDetails" ? (
          <RoomDetailsEdit />
        ) : (
          <RoomDetailsView />
        )}
        {editingSection === "sleeping" ? (
          <SleepingArrangementEdit />
        ) : (
          <SleepingArrangementView />
        )}
        {editingSection === "bathroom" ? (
          <BathroomDetailsEdit />
        ) : (
          <BathroomDetailsView />
        )}
        {editingSection === "amenities" ? (
          <AmenityDetailsEdit />
        ) : (
          <AmenityDetailsView />
        )}
        {editingSection === "photos" ? (
          <PhotosVideosEdit />
        ) : (
          <PhotosVideosView />
        )}
      </div>
    </div>
  );
};

export default HotelRoomManager;
