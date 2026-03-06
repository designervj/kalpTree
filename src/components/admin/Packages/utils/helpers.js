// ─── UTILS ────────────────────────────────────────────────────────
export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const cls = (...a) => a.filter(Boolean).join(" ");

export const fmt12 = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const getCurrSym = (code) =>
  ({ INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "د.إ" })[code] || code;

export const parseDays = (dur) => {
  const m = dur?.match(/^(\d+)\s*Day/i);
  return m ? parseInt(m[1]) : 0;
};

// ─── RESOLVE HELPERS (two-way sync merge) ─────────────────────────
export const resolveActivity = (dayAct, masters) => {
  const m = masters.find((x) => x._id === dayAct.activityRef);
  return {
    ...m,
    ...dayAct,
    title: dayAct.customTitle || m?.title || "Untitled Activity",
    description: dayAct.customDescription || m?.description || "",
    images: dayAct.customImages?.length ? dayAct.customImages : m?.images || [],
    activityType: m?.activityType || "sightseeing",
    duration: m?.defaultDuration || "—",
    isLinked: !!m,
    masterTitle: m?.title,
  };
};

export const resolveHotel = (dayHotel, masters) => {
  const m = masters.find((x) => x._id === dayHotel.hotelRef);
  return {
    ...m,
    ...dayHotel,
    hotelName: m?.hotelName || "Unknown Hotel",
    city: m?.city || "",
    starRating: m?.starRating || "5",
    images: dayHotel.customImages?.length ? dayHotel.customImages : m?.images || [],
    roomType: dayHotel.customRoomType || m?.roomTypes?.[0] || "",
    notes: dayHotel.customNotes || "",
    isLinked: !!m,
    masterName: m?.hotelName,
  };
};

// ─── FACTORIES ────────────────────────────────────────────────────
export const emptyMasterActivity = () => ({
  _id: uid(),
  title: "",
  description: "",
  activityType: "sightseeing",
  defaultDuration: "1 hr",
  location: "",
  tags: [],
  images: [],
});

export const emptyMasterHotel = () => ({
  _id: uid(),
  hotelName: "",
  city: "",
  starRating: "5",
  description: "",
  roomTypes: [],
  amenities: [],
  images: [],
});

export const emptyDayActivity = () => ({
  id: uid(),
  activityRef: null,
  time: "09:00",
  customTitle: "",
  customDescription: "",
  customImages: [],
  guideIncluded: false,
  ticketIncluded: false,
  coverTitle: "",
});

export const emptyDayHotel = () => ({
  id: uid(),
  hotelRef: null,
  customRoomType: "",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  customNotes: "",
  customImages: [],
  mealInclusions: { breakfast: false, lunch: false, dinner: false },
});

export const emptyTransfer = () => ({
  id: uid(),
  transferType: "Private",
  vehicleType: "Sedan",
  from: "",
  to: "",
  pickupTime: "08:00",
  dropTime: "10:00",
  notes: "",
});

export const emptyFaq = () => ({ id: uid(), question: "", answer: "" });

export const emptyKBYG = () => ({ id: uid(), point: "" });

export const emptyAdditionalInfo = () => ({
  aboutDestination: "",
  quickInfo: {
    destinationsCovered: "",
    duration: "",
    startPoint: "",
    endPoint: "",
  },
  experiencesCovered: [],
  notToMiss: [],
});

export const makeDay = (n) => ({
  id: uid(),
  dayNumber: n,
  title: n === 1 ? "Arrival Day" : `Day ${n}`,
  city: "",
  dayType: n === 1 ? "arrival" : "sightseeing",
  mealsIncluded: [],
  notes: "",
  description: "",
  hotelStays: [],
  transfers: [],
  activities: [],
});
