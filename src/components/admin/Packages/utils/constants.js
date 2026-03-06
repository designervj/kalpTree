// ─── DURATION OPTIONS ─────────────────────────────────────────────
export const DURATION_OPTIONS = [
  "2 Days / 1 Night",
  "3 Days / 2 Nights",
  "4 Days / 3 Nights",
  "5 Days / 4 Nights",
  "6 Days / 5 Nights",
  "7 Days / 6 Nights",
  "8 Days / 7 Nights",
  "10 Days / 9 Nights",
  "12 Days / 11 Nights",
  "14 Days / 13 Nights",
  "15 Days / 14 Nights",
];

export const OPTIONS = {
  activityType: [
    "meal",
    "sightseeing",
    "adventure",
    "transfer",
    "leisure",
    "wellness",
    "shopping",
  ],
  dayType: ["arrival", "sightseeing", "transfer", "leisure", "departure"],
  starRating: ["1", "2", "3", "4", "5"],
  roomType: [
    "Deluxe Room",
    "Superior Room",
    "Suite",
    "Junior Suite",
    "Sea View Room",
    "Pool Villa",
    "Cottage",
    "Penthouse",
  ],
  vehicleType: [
    "Sedan",
    "SUV",
    "Tempo Traveller",
    "Luxury Coach",
    "Speedboat",
    "Ferry",
    "Train",
    "Tuk-Tuk",
    "Helicopter",
  ],
  transferType: ["Private", "Shared"],
  mealsOptions: ["Breakfast", "Lunch", "Dinner"],
  travelStyle: [
    "Luxury",
    "Premium",
    "Budget",
    "Adventure",
    "Cultural Immersion",
    "Family",
    "Group Tour",
  ],
  exclusivity: ["Standard", "Premium", "Exclusive", "Ultra-Luxury"],
  tourType: [
    "Relaxation",
    "Heritage",
    "Adventure Sports",
    "Wildlife",
    "Religious",
    "Culinary",
    "Beach",
    "Honeymoon",
    "Family",
  ],
  amenities: [
    "Swimming Pool",
    "Spa & Wellness",
    "Fitness Center",
    "Restaurant",
    "Bar/Lounge",
    "Business Center",
    "Airport Shuttle",
    "Concierge",
    "Valet Parking",
    "Kids Club",
    "Room Service",
    "Butler Service",
    "Private Beach",
    "Rooftop",
    "Laundry",
  ],
};

export const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR — Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "AED", symbol: "د.إ", label: "AED — UAE Dirham" },
  { code: "SGD", symbol: "S$", label: "SGD — Singapore Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD — Australian Dollar" },
  { code: "THB", symbol: "฿", label: "THB — Thai Baht" },
];

// ─── STYLE MAPS ───────────────────────────────────────────────────
export const DAY_GRAD = {
  arrival: "from-emerald-900 to-emerald-800",
  sightseeing: "from-blue-950 to-blue-900",
  transfer: "from-orange-900 to-orange-800",
  leisure: "from-violet-900 to-violet-800",
  departure: "from-slate-800 to-slate-700",
};

export const DAY_BADGE = {
  arrival: "bg-emerald-100 text-emerald-800 border-emerald-200",
  sightseeing: "bg-sky-100 text-sky-800 border-sky-200",
  transfer: "bg-orange-100 text-orange-800 border-orange-200",
  leisure: "bg-violet-100 text-violet-800 border-violet-200",
  departure: "bg-slate-100 text-slate-700 border-slate-200",
};

export const ACT_DOT = {
  meal: "bg-amber-500",
  sightseeing: "bg-blue-600",
  adventure: "bg-emerald-600",
  transfer: "bg-orange-500",
  leisure: "bg-violet-500",
  wellness: "bg-pink-500",
  shopping: "bg-rose-500",
};

export const ACT_BADGE = {
  meal: "bg-amber-50 text-amber-800",
  sightseeing: "bg-blue-50 text-blue-800",
  adventure: "bg-emerald-50 text-emerald-800",
  transfer: "bg-orange-50 text-orange-800",
  leisure: "bg-violet-50 text-violet-800",
  wellness: "bg-pink-50 text-pink-800",
  shopping: "bg-rose-50 text-rose-800",
};
