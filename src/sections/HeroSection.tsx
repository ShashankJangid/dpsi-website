import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";

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

const heroCoverflowSlides: CoverflowSlide[] = [
  {
    src: "/images/facilities/ai_robotics_lab.webp",
    alt: "State-of-the-Art AI & Robotics Lab",
    title: "AI & Robotics Innovation Lab",
    subtitle: "Class VI to XII • C-Block 3rd Floor",
    meta: [
      { label: "Lab Type", value: "Futuristic AI & IoT" },
      { label: "Equipment", value: "Humanoid Robots & 3D" },
      { label: "Curriculum", value: "Python ML & Robotics" },
    ],
  },
  {
    src: "/images/dps/slider_1.webp",
    alt: "Welcome to DPS Indirapuram",
    title: "DPS Indirapuram Campus",
    subtitle: "Ahinsa Khand-II, Indirapuram, Ghaziabad",
    meta: [
      { label: "Affiliation", value: "CBSE (No. 2130647)" },
      { label: "Campus Area", value: "10+ Acres Green" },
      { label: "Admissions", value: "2026-27 Open" },
    ],
  },
  {
    src: "/images/dps/slider_2.webp",
    alt: "Times Education Icons 2024",
    title: "Times Education Icons 2024",
    subtitle: "Recognized as the premier CBSE school in Ghaziabad",
    meta: [
      { label: "Award", value: "Times Education 2024" },
      { label: "Ranking", value: "#1 in Ghaziabad" },
      { label: "Board", value: "100% CBSE Pass Rate" },
    ],
  },
  {
    src: "/images/facilities/quantum_science_lab.webp",
    alt: "Quantum & Modern Science Laboratories",
    title: "Advanced Science Labs",
    subtitle: "Physics, Chemistry & Biology Research",
    meta: [
      { label: "Facilities", value: "Modern Apparatus" },
      { label: "Safety", value: "100% Certified" },
      { label: "Experiments", value: "Hands-on Practical" },
    ],
  },
  {
    src: "/images/facilities/swimming_pool.webp",
    alt: "Olympic Size Aquatic Center",
    title: "Olympic Aquatic Center",
    subtitle: "All-weather Swimming Pool & Training",
    meta: [
      { label: "Pool Standard", value: "Olympic Regulation" },
      { label: "Coaching", value: "National Level Coaches" },
      { label: "Life Guards", value: "24/7 On Duty" },
    ],
  },
  {
    src: "/images/dps/slider_5.webp",
    alt: "Holistic Student Development",
    title: "Holistic Development",
    subtitle: "Nurturing sports, arts, academics and leadership skills",
    meta: [
      { label: "Co-Curricular", value: "50+ Active Clubs" },
      { label: "Sports", value: "Football, Cricket, Tennis" },
      { label: "Leadership", value: "Student Council & MUN" },
    ],
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"cinematic" | "coverflow">("cinematic");

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
    if (viewMode !== "cinematic") return;
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
  }, [displayText, isDeleting, fullText, viewMode]);

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
                {viewMode === "cinematic" ? displayText : "3D Interactive Coverflow Gallery — Drag & Explore Campus"}
              </span>
              {viewMode === "cinematic" && (
                <span className="inline-block w-1.5 h-4 sm:w-2 sm:h-5 bg-sky-600 ml-1 animate-pulse shrink-0" />
              )}
            </div>
          </div>

          {/* Mode Switcher & Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center p-0.5 bg-sky-200/60 rounded-xl border border-sky-300/80">
              <button
                onClick={() => setViewMode("cinematic")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "cinematic"
                    ? "bg-white text-sky-950 shadow-xs"
                    : "text-sky-800 hover:text-sky-950"
                }`}
                title="Cinematic Banner View"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Banner</span>
              </button>
              <button
                onClick={() => setViewMode("coverflow")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "coverflow"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-sky-800 hover:text-sky-950"
                }`}
                title="3D Coverflow Interactive View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Coverflow</span>
              </button>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-xl transition-all duration-300 text-xs shadow-md shadow-sky-600/25 cursor-pointer flex items-center gap-1"
                asChild
              >
                <Link to="/admissions">
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </div>

      {/* HERO SECTION: CINEMATIC SLIDER OR 3D COVERFLOW */}
      <section className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[75vh] overflow-hidden bg-slate-950 flex items-center justify-center">
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

        {viewMode === "cinematic" ? (
          <>
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
          </>
        ) : (
          /* 3D COVERFLOW HERO VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl mx-auto px-4 py-8 relative z-20 text-white flex flex-col items-center"
          >
            <div className="text-center mb-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest bg-sky-950/60 px-3 py-1 rounded-full border border-sky-400/30">
                Interactive 3D Coverflow
              </span>
            </div>

            <CoverflowCarousel
              slides={heroCoverflowSlides}
              showCaption={true}
              showNavigation={true}
              showPagination={true}
              cardWidth="clamp(160px, 24vw, 290px)"
              rotate={44}
              depth={0.65}
              perspective={3.2}
              className="py-2"
              cardClassName="border-2 border-sky-400/40 shadow-2xl rounded-3xl"
            />
          </motion.div>
        )}
      </section>
    </div>
  );
}