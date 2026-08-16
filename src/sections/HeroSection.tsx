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
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  const slide = heroSlides[currentSlide];
  const fullText = `${slide.title} — ${slide.subtitle}`;

  // Typewriter backspacing and re-writing visual effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText.length < fullText.length) {
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 40);
    } else if (!isDeleting && displayText.length === fullText.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2600);
    } else if (isDeleting && displayText.length > 0) {
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length - 1));
      }, 20);
    } else if (isDeleting && displayText.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 10);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText]);

  const handleManualSlideChange = (newIndex: number) => {
    setIsDeleting(false);
    setDisplayText("");
    setCurrentSlide(newIndex);
  };

  return (
    <div className="w-full flex flex-col bg-slate-50">
      {/* SEPARATE TEXT BAR ABOVE IMAGE WITH TYPEWRITER BACKSPACE & REWRITE EFFECT (LIGHT THEME) */}
      <div className="relative z-30 bg-gradient-to-r from-sky-100 via-white to-blue-50 text-slate-900 border-b border-sky-200/80 py-3.5 sm:py-4 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Badge & Animated Typewriter Text */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-600 text-white text-[11px] font-bold tracking-wide uppercase shrink-0 w-max shadow-xs">
              {slide.badge}
            </span>

            <div className="text-xs sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight min-h-[2.5rem] sm:min-h-[1.75rem] flex items-center min-w-0">
              <span className="text-sky-950 drop-shadow-2xs leading-tight sm:leading-snug break-words">
                {displayText}
              </span>
              <span className="inline-block w-1.5 h-4 sm:w-2 sm:h-5 bg-sky-600 ml-1 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Action Buttons with Spring Hover/Tap Physics */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 text-xs shadow-md shadow-sky-600/25 cursor-pointer flex items-center gap-1"
                asChild
              >
                <Link to="/admissions">
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="border border-sky-300 bg-white hover:bg-sky-50 text-sky-900 px-4 py-2 rounded-xl font-bold transition-all duration-300 text-xs cursor-pointer shadow-xs"
                asChild
              >
                <Link to="/about">Explore Campus</Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* FULL UNBLOCKED HERO IMAGE SLIDER BELOW THE BAR */}
      <section className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[75vh] overflow-hidden bg-slate-950">
        {/* Subtle Ambient Floating Glow Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none z-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none z-10"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950 overflow-hidden"
          >
            {/* 100% Unblocked Banner Image displayed in full natural color */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center z-0 will-change-transform"
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </AnimatePresence>

        {/* Slide Navigation Controls with Glassmorphism and Spring Bounce */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 z-30 flex items-center gap-3 bg-slate-950/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 shadow-2xl">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleManualSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 px-1">
            {heroSlides.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleManualSlideChange(idx)}
                animate={{
                  width: currentSlide === idx ? 24 : 8,
                  backgroundColor: currentSlide === idx ? "#38bdf8" : "rgba(255, 255, 255, 0.45)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-2 rounded-full cursor-pointer shadow-xs"
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleManualSlideChange((currentSlide + 1) % heroSlides.length)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}