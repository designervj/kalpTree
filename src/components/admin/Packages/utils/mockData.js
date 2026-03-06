// ─── MOCK DATA ────────────────────────────────────────────────────
export const INIT_ACTIVITIES = [
  {
    _id: "ma-001",
    title: "Amber Fort Guided Tour",
    description:
      "Explore the magnificent Amber Fort with a certified local guide. Includes elephant ride option.",
    activityType: "sightseeing",
    defaultDuration: "3 hrs",
    location: "Jaipur, Rajasthan",
    tags: ["Heritage", "UNESCO", "Fort"],
    images: [],
  },
  {
    _id: "ma-002",
    title: "Sunrise Yoga on Beach",
    description:
      "Rejuvenating beachfront yoga session with a certified instructor. All mats and props provided.",
    activityType: "wellness",
    defaultDuration: "1 hr",
    location: "Seminyak, Bali",
    tags: ["Wellness", "Beach", "Morning"],
    images: [],
  },
  {
    _id: "ma-003",
    title: "Kelingking Beach Viewpoint",
    description:
      "Iconic T-Rex cliff viewpoint visit with optional snorkeling. Breathtaking Pacific views.",
    activityType: "adventure",
    defaultDuration: "2 hrs",
    location: "Nusa Penida, Bali",
    tags: ["Beach", "Scenic", "Adventure"],
    images: [],
  },
  {
    _id: "ma-004",
    title: "Traditional Cooking Class",
    description:
      "Learn authentic local recipes from a master chef. Includes market visit and 3-course meal.",
    activityType: "meal",
    defaultDuration: "4 hrs",
    location: "Ubud, Bali",
    tags: ["Culinary", "Cultural", "Hands-on"],
    images: [],
  },
  {
    _id: "ma-005",
    title: "Desert Camel Safari",
    description:
      "Sunset camel safari across the Sam Sand Dunes with cultural camp dinner and folk performance.",
    activityType: "adventure",
    defaultDuration: "3 hrs",
    location: "Jaisalmer, Rajasthan",
    tags: ["Desert", "Safari", "Sunset"],
    images: [],
  },
];

export const INIT_HOTELS = [
  {
    _id: "mh-001",
    hotelName: "The Layar Private Villas",
    city: "Seminyak, Bali",
    starRating: "5",
    description:
      "Iconic private pool villas with butler service and tropical gardens.",
    roomTypes: ["Private Pool Villa", "Garden Villa", "Royal Villa"],
    amenities: [
      "Swimming Pool",
      "Spa & Wellness",
      "Restaurant",
      "Butler Service",
      "Room Service",
    ],
    images: [],
  },
  {
    _id: "mh-002",
    hotelName: "Rambagh Palace",
    city: "Jaipur, Rajasthan",
    starRating: "5",
    description:
      "Former residence of the Maharaja of Jaipur — legendary Taj property.",
    roomTypes: ["Deluxe Room", "Suite", "Signature Suite", "Royal Suite"],
    amenities: [
      "Swimming Pool",
      "Spa & Wellness",
      "Restaurant",
      "Bar/Lounge",
      "Butler Service",
      "Fitness Center",
    ],
    images: [],
  },
  {
    _id: "mh-003",
    hotelName: "COMO Uma Ubud",
    city: "Ubud, Bali",
    starRating: "5",
    description:
      "Stunning hillside retreat above the Tjujungan River renowned for wellness.",
    roomTypes: ["Uma Suite", "Pool Villa", "Garden Terrace Suite"],
    amenities: [
      "Swimming Pool",
      "Spa & Wellness",
      "Restaurant",
      "Fitness Center",
      "Concierge",
    ],
    images: [],
  },
];

export const INIT_PACKAGES = [
  {
    id: "pkg-001",
    title: "Bali Royal Escape",
    destination: "Bali, Indonesia",
    tripDuration: "5 Days / 4 Nights",
    travelStyle: "Luxury",
    tourType: "Relaxation",
    exclusivityLevel: "Premium",
    price: { currency: "USD", amount: 2499 },
    shortDescription:
      "An immersive Bali escape blending ancient temples, rice terraces, and pristine beaches.",
    availability: {
      availableMonths: ["October", "November", "December"],
      fixedDepartureDates: [],
      blackoutDates: [],
    },
    inclusions: [
      "4 nights luxury accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Private villa pool access",
      "Certified local guide for all excursions",
    ],
    exclusions: [
      "International airfare",
      "Travel insurance",
      "Personal expenses",
      "Visa charges",
    ],
    knowBeforeYouGo: [
      {
        id: "kbyg-1",
        point:
          "We are not liable for change in itinerary due to any reason like a change in flight schedule, political disturbances, or natural phenomena.",
      },
      {
        id: "kbyg-2",
        point:
          "Prices are subject to change as per availability of hotel rooms, especially during peak season.",
      },
      {
        id: "kbyg-3",
        point:
          "Personal expenses and mandatory hotel taxes (if any) will have to be paid by you at the destination.",
      },
      {
        id: "kbyg-4",
        point:
          "ID proof is mandatory for each individual guest at the time of booking and also upon arrival.",
      },
    ],
    additionalInfo: {
      aboutDestination:
        "Known as the 'Island of the Gods', Bali is renowned for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.",
      quickInfo: {
        destinationsCovered: "Seminyak, Ubud, Nusa Penida",
        duration: "5 Days, 4 Nights",
        startPoint: "Ngurah Rai International Airport (DPS)",
        endPoint: "Ngurah Rai International Airport (DPS)",
      },
      experiencesCovered: [
        "Sunrise yoga on the beach at Seminyak",
        "Kelingking Beach T-Rex viewpoint on Nusa Penida",
        "Authentic Balinese cooking class in Ubud",
        "Speedboat island hopping",
      ],
      notToMiss: [
        "Witness the Kecak fire dance at Uluwatu Temple",
        "Explore the Sacred Monkey Forest Sanctuary",
        "Visit Tegalalang Rice Terraces at sunrise",
      ],
    },
    faqs: [
      {
        id: "faq-1",
        question: "Are international flights included?",
        answer:
          "No, international airfare is not included. The package covers all local transfers, accommodation, and listed activities.",
      },
      {
        id: "faq-2",
        question: "What is the best time to visit Bali?",
        answer:
          "October to March is ideal — warm weather, clear skies, and festive energy.",
      },
      {
        id: "faq-3",
        question: "Is this package suitable for solo travelers?",
        answer:
          "Absolutely. You'll have your own private villa room and a dedicated guide throughout.",
      },
    ],
    itinerary: [
      {
        id: "d1",
        dayNumber: 1,
        title: "Arrival & Welcome",
        city: "Seminyak",
        dayType: "arrival",
        mealsIncluded: ["Dinner"],
        notes: "Private airport transfer included.",
        hotelStays: [
          {
            id: "dh1",
            hotelRef: "mh-001",
            customRoomType: "Private Pool Villa",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            customNotes: "Welcome fruit basket.",
            customImages: [],
            mealInclusions: { breakfast: true, lunch: false, dinner: true },
          },
        ],
        transfers: [
          {
            id: "dt1",
            transferType: "Private",
            vehicleType: "SUV",
            from: "Ngurah Rai Airport",
            to: "Seminyak",
            pickupTime: "14:00",
            dropTime: "15:00",
            notes: "Name board at arrivals.",
          },
        ],
        activities: [
          {
            id: "da1",
            activityRef: "ma-002",
            time: "06:30",
            customTitle: "",
            customDescription: "",
            customImages: [],
            guideIncluded: true,
            ticketIncluded: false,
            coverTitle: "Start your day right",
          },
        ],
      },
      {
        id: "d2",
        dayNumber: 2,
        title: "Temples & Rice Terraces",
        city: "Ubud",
        dayType: "sightseeing",
        mealsIncluded: ["Breakfast", "Lunch"],
        notes: "Wear modest clothing.",
        hotelStays: [
          {
            id: "dh2",
            hotelRef: "mh-003",
            customRoomType: "Uma Suite",
            checkInTime: "14:00",
            checkOutTime: "11:00",
            customNotes: "",
            customImages: [],
            mealInclusions: { breakfast: true, lunch: true, dinner: false },
          },
        ],
        transfers: [
          {
            id: "dt2",
            transferType: "Private",
            vehicleType: "Sedan",
            from: "Seminyak",
            to: "Ubud",
            pickupTime: "08:00",
            dropTime: "09:00",
            notes: "",
          },
        ],
        activities: [
          {
            id: "da2",
            activityRef: "ma-003",
            time: "09:30",
            customTitle: "",
            customDescription: "",
            customImages: [],
            guideIncluded: true,
            ticketIncluded: true,
            coverTitle: "",
          },
          {
            id: "da3",
            activityRef: "ma-004",
            time: "14:00",
            customTitle: "",
            customDescription: "",
            customImages: [],
            guideIncluded: false,
            ticketIncluded: false,
            coverTitle: "",
          },
        ],
      },
      {
        id: "d3",
        dayNumber: 3,
        title: "Beach Leisure",
        city: "Seminyak",
        dayType: "leisure",
        mealsIncluded: ["Breakfast"],
        notes: "",
        hotelStays: [
          {
            id: "dh3",
            hotelRef: "mh-001",
            customRoomType: "",
            checkInTime: "14:00",
            checkOutTime: "11:00",
            customNotes: "",
            customImages: [],
            mealInclusions: { breakfast: true, lunch: false, dinner: false },
          },
        ],
        transfers: [],
        activities: [],
      },
      {
        id: "d4",
        dayNumber: 4,
        title: "Island Adventure",
        city: "Nusa Penida",
        dayType: "sightseeing",
        mealsIncluded: ["Breakfast", "Lunch"],
        notes: "Speedboat at 7:30 AM.",
        hotelStays: [
          {
            id: "dh4",
            hotelRef: "mh-001",
            customRoomType: "",
            checkInTime: "14:00",
            checkOutTime: "11:00",
            customNotes: "",
            customImages: [],
            mealInclusions: { breakfast: true, lunch: false, dinner: false },
          },
        ],
        transfers: [
          {
            id: "dt3",
            transferType: "Private",
            vehicleType: "Speedboat",
            from: "Sanur Beach",
            to: "Nusa Penida",
            pickupTime: "07:30",
            dropTime: "08:15",
            notes: "",
          },
        ],
        activities: [
          {
            id: "da4",
            activityRef: "ma-003",
            time: "09:00",
            customTitle: "",
            customDescription: "",
            customImages: [],
            guideIncluded: true,
            ticketIncluded: true,
            coverTitle: "Jaw-dropping vistas",
          },
        ],
      },
      {
        id: "d5",
        dayNumber: 5,
        title: "Departure",
        city: "Denpasar",
        dayType: "departure",
        mealsIncluded: ["Breakfast"],
        notes: "Check-out 11 AM.",
        hotelStays: [],
        transfers: [
          {
            id: "dt4",
            transferType: "Private",
            vehicleType: "SUV",
            from: "Seminyak",
            to: "Airport",
            pickupTime: "12:30",
            dropTime: "13:15",
            notes: "",
          },
        ],
        activities: [],
      },
    ],
    createdAt: "2025-01-15",
  },
];
