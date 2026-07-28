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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-emerald-950/75 to-slate-950/40 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-white"
        >
          <div className="inline-block px-4 py-2 rounded-md bg-emerald-600/30 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-sm font-bold tracking-wide mb-6 uppercase">
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            {slide.title}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-200 mb-8 font-medium leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-xl shadow-emerald-950/40 rounded-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/admissions">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="border border-white/80 bg-white/15 backdrop-blur-md text-white hover:bg-white hover:text-slate-950 px-8 rounded-xl font-bold transition-all duration-300 shadow-md"
              asChild
            >
              <Link to="/about">Explore Campus</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}