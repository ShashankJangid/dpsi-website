import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    image: "/images/dps/slider_1.webp",
    title: "Welcome to DPS Indirapuram",
    subtitle: "Soaring High... We reach for the sky!",
    badge: "Admissions Open 2026-27"
  },
  {
    image: "/images/dps/slider_2.webp",
    title: "Times Education Icons 2024",
    subtitle: "Recognized as the premier CBSE school in Ghaziabad",
    badge: "Excellence in Education"
  },
  {
    image: "/images/dps/slider_3.webp",
    title: "State-of-the-Art AI & Robotics Lab",
    subtitle: "Fostering technological innovation and futuristic learning",
    badge: "Next-Gen Infrastructure"
  },
  {
    image: "/images/dps/slider_4.webp",
    title: "Quantum Science & Physics Lab",
    subtitle: "Advanced research apparatus for young innovators",
    badge: "Innovation Hub"
  },
  {
    image: "/images/dps/slider_5.webp",
    title: "Holistic Student Development",
    subtitle: "Nurturing sports, arts, academics and leadership skills",
    badge: "Empowering Future Leaders"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[65vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 flex items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Ambient blurred backdrop for seamless filling */}
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
          />
          {/* Main banner image - aligned centered for mobile & desktop */}
          <img
            src={slide.image}
            alt={slide.title}
            className="relative w-full h-full object-cover object-center z-0"
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-white"
        >
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-emerald-600/40 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-bold tracking-wide mb-4 sm:mb-6 uppercase">
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-4 sm:mb-6 tracking-tight">
            {slide.title}
          </h1>

          <p className="text-base sm:text-2xl text-slate-200 mb-6 sm:mb-8 font-medium leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 sm:px-8 shadow-xl shadow-emerald-950/40 rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              asChild
            >
              <Link to="/admissions">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="border border-white/80 bg-white/15 backdrop-blur-md text-white hover:bg-white hover:text-slate-950 px-6 sm:px-8 rounded-xl font-bold transition-all duration-300 shadow-md text-sm sm:text-base"
              asChild
            >
              <Link to="/about">Explore Campus</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-8 z-30 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="p-2.5 sm:p-3 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="p-2.5 sm:p-3 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}