import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const videos = [
  {
    id: "Nn2K8b2JQn0",
    title: "India's First Advanced AI & Robotics Lab | DPS Indirapuram",
    url: "https://www.youtube.com/embed/Nn2K8b2JQn0?autoplay=1&rel=0",
    thumbnail: "https://img.youtube.com/vi/Nn2K8b2JQn0/hqdefault.jpg"
  },
  {
    id: "UDcIVb8OpNw",
    title: "DPS Indirapuram — Annual Cultural Celebration & Excellence",
    url: "https://www.youtube.com/embed/UDcIVb8OpNw?autoplay=1&rel=0",
    thumbnail: "https://img.youtube.com/vi/UDcIVb8OpNw/hqdefault.jpg"
  },
  {
    id: "89P74IV5k9M",
    title: "DPS Indirapuram — Holistic School Campus & Achievements",
    url: "https://www.youtube.com/embed/89P74IV5k9M?autoplay=1&rel=0",
    thumbnail: "https://img.youtube.com/vi/89P74IV5k9M/hqdefault.jpg"
  }
];

export default function VideoGallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeVideo = videos[currentIndex];

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <div className="w-full flex flex-col">
      {/* SKY BLUE VERY LIGHT GRADIENT SECTION BEFORE YOUTUBE LINK */}
      <div className="w-full py-14 sm:py-16 bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 border-y border-sky-200/70 text-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-600/10 border border-sky-300 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              🎬 School Video Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-950 tracking-tight font-serif">
              Experience Life at DPS Indirapuram
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto mt-3.5 rounded-full" />
            <p className="text-sky-900/80 mt-3 max-w-2xl mx-auto text-sm sm:text-base font-medium">
              Explore our state-of-the-art AI & Robotics Innovation Lab, Annual Cultural Celebrations, and campus achievements in video.
            </p>
          </motion.div>
        </div>
      </div>

      {/* YOUTUBE VIDEO GALLERY SECTION */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#064e3b] via-[#022c22] to-slate-950 text-white overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Matching User Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-white font-serif drop-shadow-md">
            VIDEO GALLERY
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-emerald-400 mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Video Player Carousel Container */}
        <div className="relative max-w-4xl mx-auto flex items-center justify-center">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:-left-14 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Previous Video"
            aria-label="Previous Video"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Video Player Box */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-400/40 shadow-2xl shadow-black/60 relative group">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <iframe
                  key={activeVideo.id}
                  src={activeVideo.url}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <motion.div
                  key={`thumb-${activeVideo.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-between p-4 sm:p-6">
                    {/* Top Title Overlay */}
                    <div className="bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 max-w-xl self-start">
                      <p className="font-extrabold text-sm sm:text-base text-white line-clamp-1">
                        {activeVideo.title}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-medium">DPS Indirapuram Official Channel</p>
                    </div>

                    {/* Center Big Red YouTube Play Button */}
                    <div className="self-center my-auto">
                      <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-2xl bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-2xl shadow-red-950/80 transition-all hover:scale-110">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Watch prompt */}
                    <div className="self-end text-xs font-semibold text-white/80 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                      Click to Watch Video ▶
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:-right-14 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            title="Next Video"
            aria-label="Next Video"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto max-w-3xl mx-auto py-2">
          {videos.map((vid, index) => (
            <button
              key={vid.id}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 w-28 sm:w-36 aspect-video ${
                currentIndex === index
                  ? "border-amber-400 scale-105 shadow-lg shadow-amber-400/20"
                  : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  </div>
);
}
