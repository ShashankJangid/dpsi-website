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
    <div className="w-full flex flex-col bg-slate-950">
      {/* SEPARATE TEXT BAR ABOVE IMAGE WITH TYPEWRITER BACKSPACE & REWRITE EFFECT */}
      <div className="relative z-30 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border-b border-emerald-500/30 py-3.5 sm:py-4 px-4 sm:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Badge & Animated Typewriter Text */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold tracking-wide uppercase shrink-0 w-max shadow-sm">
              {slide.badge}
            </span>

            <div className="text-xs sm:text-base lg:text-lg font-bold text-white tracking-tight min-h-[2.5rem] sm:min-h-[1.75rem] flex items-center min-w-0">
              <span className="text-emerald-300 drop-shadow-sm leading-tight sm:leading-snug break-words">
                {displayText}
              </span>
              <span className="inline-block w-1.5 h-4 sm:w-2 sm:h-5 bg-emerald-400 ml-1 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-xs shadow-md cursor-pointer"
              asChild
            >
              <Link to="/admissions">
                Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
            <Button
              size="sm"
              className="border border-white/40 bg-white/10 hover:bg-white hover:text-slate-950 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 text-xs cursor-pointer"
              asChild
            >
              <Link to="/about">Explore Campus</Link>
            </Button>
          </div>

        </div>
      </div>

      {/* FULL UNBLOCKED HERO IMAGE SLIDER BELOW THE BAR */}
      <section className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[75vh] overflow-hidden bg-slate-950">
        <AnimatePresence>
          <motion.div
            key={slide.image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950 overflow-hidden"
          >
            {/* 100% Unblocked Banner Image displayed in full natural color */}
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

        {/* Slide Navigation Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 z-30 flex items-center gap-3">
          <button
            onClick={() => handleManualSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
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
                onClick={() => handleManualSlideChange(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleManualSlideChange((currentSlide + 1) % heroSlides.length)}
            className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}