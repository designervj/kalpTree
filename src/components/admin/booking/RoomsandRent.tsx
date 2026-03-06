"use client";

import React, { useState, useEffect } from "react";
import { Edit2, X, Plus, Minus, ChevronDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";

const HotelRoomManager = () => {
  // Simulate pathname - in real app, use usePathname() from next/navigation
  const pathname = usePathname();
  // const [pathname, setPathname] = useState("/create"); // Change to "/edit" to test edit mode
  const isCreateMode = pathname.includes("create");

  const [currentStep, setCurrentStep] = useState(1);
  const [editingSection, setEditingSection] = useState(null);
  const [roomData, setRoomData] = useState({
    roomType: "",
    roomView: "",
    roomSize: "",
    roomSizeUnit: "Square Meter",
    roomName: "",
    numberOfRooms: 1,
    description: "",
    bedType: "Double Bed",
    numberOfBeds: 1,
    extraBeds: false,
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
    photos: [],
  });

  // Set initial data for edit mode
  useEffect(() => {
    if (!isCreateMode) {
      setRoomData({
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
    } else {
      // Reset for create mode
      setRoomData({
        roomType: "",
        roomView: "",
        roomSize: "",
        roomSizeUnit: "Square Meter",
        roomName: "",
        numberOfRooms: 1,
        description: "",
        bedType: "Double Bed",
        numberOfBeds: 1,
        extraBeds: false,
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
        photos: [],
      });
      setCurrentStep(1);
    }
  }, [isCreateMode]);

  const steps = [
    { number: 1, title: "Room Details", section: "roomDetails" },
    {
      number: 2,
      title: "Sleeping Arrangement & Occupancy",
      section: "sleeping",
    },
    { number: 3, title: "Bathroom Details", section: "bathroom" },
    { number: 4, title: "Amenity Details", section: "amenities" },
    { number: 5, title: "Photos & Videos", section: "photos" },
  ];

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = () => {
    if (isCreateMode) {
      // In create mode, move to next step
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        setEditingSection(steps[currentStep].section);
      } else {
        // Final step - submit
        console.log("Room created:", roomData);
        alert("Room created successfully!");
      }
    } else {
      // In edit mode, just close editing
      setEditingSection(null);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      // In create mode, go back to previous step
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        setEditingSection(steps[currentStep - 2].section);
      }
    } else {
      setEditingSection(null);
    }
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

  // Set editing section when step changes in create mode
  useEffect(() => {
    if (isCreateMode) {
      setEditingSection(steps[currentStep - 1].section);
    }
  }, [currentStep, isCreateMode]);

  // Step indicator for create mode
  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-start">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step.number < currentStep
                    ? "bg-green-600 text-white"
                    : step.number === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mt-5 ${step.number < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Collapsible section card for create mode
  const CollapsibleSection = ({ step, children, isExpanded }) => (
    <div
      className={`bg-white rounded-lg border border-gray-200 mb-4 ${!isExpanded ? "opacity-60" : ""
        }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step.number < currentStep
                ? "bg-green-600 text-white"
                : step.number === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {step.number < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              step.number
            )}
          </div>
          <h2 className="text-xl font-bold">{step.title}</h2>
        </div>
        {isExpanded && children}
      </div>
    </div>
  );

  // Room Details Components
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
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Add the name and key features of this room type
      </p>

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
          <option value="">Select room type</option>
          <option>Deluxe</option>
          <option>Standard</option>
          <option>Suite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Room view</label>
        <p className="text-sm text-gray-600 mb-2">
          Describe what the guest will see from this room, like pool, garden, or
          city views.
        </p>
        <select
          value={roomData.roomView}
          onChange={(e) => updateField("roomView", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select room view</option>
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
            onChange={(e) => updateField("roomSize", e.target.value)}
            placeholder="Enter size (Area)"
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
          placeholder="Example: Luxury room with private pool"
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
            updateField("numberOfRooms", parseInt(e.target.value) || 1)
          }
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Description of the room (Optional)
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Highlight what makes this room appealing — its view, comfort, and key
          features.
        </p>
        <ul className="text-sm text-gray-600 mb-2 ml-4 list-disc">
          <li>Highlight what makes the room special</li>
          <li>Describe what can be seen from the room</li>
          <li>List the features and services provided</li>
        </ul>
        <textarea
          value={roomData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Write the description"
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isCreateMode ? (currentStep < 5 ? "Continue" : "Submit") : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Sleeping Arrangement Components
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
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Select bed types and how many guests this room can host
      </p>

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
                Maximum number of adults that can be accommodated in this room.
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
                Maximum number of free children that can be accommodated in this
                room.
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
                Maximum number of guests that can be accommodated in this room.
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

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isCreateMode ? (currentStep < 5 ? "Continue" : "Submit") : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Bathroom Details Components
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
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Add details of bathroom(s) for this room type
      </p>

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

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isCreateMode ? (currentStep < 5 ? "Continue" : "Submit") : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Amenity Details Components
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
        <p className="font-semibold">
          Select amenities for this room to help travelers know what to expect
          during their stay
        </p>
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
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Select the amenities available in this room to help travelers know what
        to expect during their stay
      </p>

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
          <h3 className="font-bold mb-2">Room Features</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Media and Entertainment</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Food and Drinks</h3>
        </div>

        <div>
          <h3 className="font-bold mb-2">Kitchen and Appliances</h3>
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

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isCreateMode ? (currentStep < 5 ? "Continue" : "Submit") : "Save"}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Photos & Videos Components
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
        {roomData.photos.length > 0 ? (
          roomData.photos.map((photo, index) => (
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
          ))
        ) : (
          <p className="text-gray-600">No photos uploaded</p>
        )}
      </div>
    </div>
  );

  const PhotosVideosEdit = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Add/Select high-quality images of the room and bathroom to help guests
        choose with confidence
      </p>

      <div>
        <h3 className="font-semibold mb-2">Add/Select photos and videos</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ensure at least 2 images of the room and 1 of the bathroom are
          uploaded.
        </p>

        {roomData.photos.length > 0 && (
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
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">Upload photos or videos</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isCreateMode ? "Submit" : "Save"}
        </button>
        <button
          onClick={handleCancel}
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
        {/* Mode Toggle (for demo purposes - remove in production) */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setPathname("/create")}
            className={`px-4 py-2 rounded ${pathname === "/create" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Create Mode
          </button>
          <button
            onClick={() => setPathname("/edit")}
            className={`px-4 py-2 rounded ${pathname === "/edit" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            Edit Mode
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <span className="text-gray-600">Property Info</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-blue-600">Rooms</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">
          {isCreateMode ? "Create Room" : "Deluxe Double or Twin Room"}
        </h1>

        {/* Step Indicator for Create Mode */}
        {isCreateMode && <StepIndicator />}

        {/* Sections */}
        {isCreateMode ? (
          // Create Mode - Step-wise with collapsible sections
          <>
            <CollapsibleSection step={steps[0]} isExpanded={currentStep >= 1}>
              {currentStep === 1 && editingSection === "roomDetails" && (
                <RoomDetailsEdit />
              )}
            </CollapsibleSection>

            <CollapsibleSection step={steps[1]} isExpanded={currentStep >= 2}>
              {currentStep === 2 && editingSection === "sleeping" && (
                <SleepingArrangementEdit />
              )}
            </CollapsibleSection>

            <CollapsibleSection step={steps[2]} isExpanded={currentStep >= 3}>
              {currentStep === 3 && editingSection === "bathroom" && (
                <BathroomDetailsEdit />
              )}
            </CollapsibleSection>

            <CollapsibleSection step={steps[3]} isExpanded={currentStep >= 4}>
              {currentStep === 4 && editingSection === "amenities" && (
                <AmenityDetailsEdit />
              )}
            </CollapsibleSection>

            <CollapsibleSection step={steps[4]} isExpanded={currentStep >= 5}>
              {currentStep === 5 && editingSection === "photos" && (
                <PhotosVideosEdit />
              )}
            </CollapsibleSection>
          </>
        ) : (
          // Edit Mode - All sections visible with edit buttons
          <>
            {editingSection === "roomDetails" ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">Room Details</h2>
                <RoomDetailsEdit />
              </div>
            ) : (
              <RoomDetailsView />
            )}

            {editingSection === "sleeping" ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">
                  Sleeping Arrangement & Occupancy
                </h2>
                <SleepingArrangementEdit />
              </div>
            ) : (
              <SleepingArrangementView />
            )}

            {editingSection === "bathroom" ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">Bathroom Details</h2>
                <BathroomDetailsEdit />
              </div>
            ) : (
              <BathroomDetailsView />
            )}

            {editingSection === "amenities" ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">Amenity Details</h2>
                <AmenityDetailsEdit />
              </div>
            ) : (
              <AmenityDetailsView />
            )}

            {editingSection === "photos" ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <h2 className="text-2xl font-bold mb-4">Photos & Videos</h2>
                <PhotosVideosEdit />
              </div>
            ) : (
              <PhotosVideosView />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HotelRoomManager;
