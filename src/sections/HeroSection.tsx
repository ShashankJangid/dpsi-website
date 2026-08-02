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
    <section className="relative min-h-[65vh] sm:min-h-[80vh] lg:min-h-[86vh] flex items-start overflow-hidden bg-slate-950 pt-4 sm:pt-8">
      <AnimatePresence>
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center bg-slate-950 overflow-hidden"
        >
          {/* Main banner image - displayed in 100% full natural color with smooth crossfade */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center z-0"
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Soft top gradient for seamless header transition */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/70 to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl text-white bg-slate-950/45 backdrop-blur-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] sm:text-xs font-bold tracking-wide mb-3 uppercase shadow-sm">
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2 sm:mb-3 tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-base text-slate-100 mb-4 font-medium leading-relaxed drop-shadow-sm">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 sm:px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm shadow-lg cursor-pointer"
              asChild
            >
              <Link to="/admissions">
                Apply Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              size="default"
              className="border border-white/80 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-950 px-5 sm:px-6 py-2 rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm cursor-pointer"
              asChild
            >
              <Link to="/about">Explore Campus</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 z-30 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
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
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}