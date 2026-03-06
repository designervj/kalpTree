"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🌟 **FIX: Naya content aur 4 slides**
const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1771922043523-b4dc45135057?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ⚠️ Nayi image ka path
    caption: "Crafting Spaces That Inspire Innovation and Creativity",
  },
  {
    image:
      "https://images.unsplash.com/photo-1771850081383-444b1f1b3470?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ⚠️ Nayi image ka path
    caption: "Designing the Future of Sustainable Urban Living",
  },
  {
    image:
      "https://images.unsplash.com/photo-1769745402932-4c93d9e76d98?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ⚠️ Nayi image ka path
    caption: "Where Vision Meets Precision in Modern Architecture",
  },
  {
    image:
      "https://media.istockphoto.com/id/1361682637/photo/blur-image-of-traffic-on-night-time.jpg?s=1024x1024&w=is&k=20&c=pFjqxwCGLGd7wz_MZOkc9T7Qtx9kub1IntbSodVfdfo=", // ⚠️ Nayi image ka path
    caption: "From Concept to Creation: Building Your Dreams",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Timer ko 5 seconds kar diya hai, taaki log caption padh sakein
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="relative w-full h-[65vh] sm:h-[90vh] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={slides[index].image}
          src={slides[index].image}
          alt={slides[index].caption}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          // 🌟 **FIX: Image ko 'center' kar diya hai proper dikhane ke liye**
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* 🔹 Bottom gradient (Thoda dark kar diya hai) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/0" />

      {/* 🔹 Caption */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full px-4 pb-16 sm:pb-20 text-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={slides[index].caption}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="text-white text-2xl sm:text-4xl lg:text-5xl font-semibold max-w-4xl md:leading-[62px]"
          >
            {slides[index].caption}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* 🔹 Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 sm:px-8 z-20">
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + slides.length) % slides.length)
          }
          className="p-1 md:p-3 sm:p-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
          className="p-1 md:p-3 sm:p-4 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* 🔹 Dots Indicator */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${i === index ? "bg-white scale-125" : "bg-white/50" // Green ki jagah white kar diya, zyada elegant lagega
              }`}
          />
        ))}
      </div>
    </section>
  );
}
