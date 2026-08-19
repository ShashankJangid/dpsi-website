import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";
import VideoGallerySection from "@/sections/VideoGallerySection";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";

const coverflowSlides: CoverflowSlide[] = [
  {
    src: "/images/facilities/ai_robotics_lab.webp",
    alt: "Futuristic AI & Robotics Innovation Lab",
    title: "AI & Robotics Innovation Lab",
    subtitle: "Equipped with Humanoids, Raspberry Pi & 3D Printers",
    meta: [
      { label: "Category", value: "Innovation & Robotics" },
      { label: "Eligibility", value: "Class VI to XII" },
      { label: "Tech Stack", value: "Python ML, IoT, Sensors" },
    ],
  },
  {
    src: "/images/facilities/quantum_science_lab.webp",
    alt: "Quantum & Modern Science Laboratories",
    title: "State-of-the-Art Science Labs",
    subtitle: "Physics, Chemistry & Biology Research Laboratories",
    meta: [
      { label: "Category", value: "Advanced Sciences" },
      { label: "Safety", value: "100% Certified Safety" },
      { label: "Pedagogy", value: "Experiential Learning" },
    ],
  },
  {
    src: "/images/facilities/swimming_pool.webp",
    alt: "Olympic-Size Swimming Pool",
    title: "Olympic Aquatic Center",
    subtitle: "All-weather training pool with certified coaches",
    meta: [
      { label: "Category", value: "Sports & Fitness" },
      { label: "Standard", value: "Olympic Regulation" },
      { label: "Trainers", value: "National-Level Coaches" },
    ],
  },
  {
    src: "/images/facilities/smart_classroom.webp",
    alt: "Interactive Smart Classroom",
    title: "Interactive Smart Classrooms",
    subtitle: "Digitally-enabled 4K learning environments",
    meta: [
      { label: "Category", value: "Digital Academics" },
      { label: "Tech", value: "Interactive Touch Panels" },
      { label: "Air Quality", value: "Centrally Air-Conditioned" },
    ],
  },
  {
    src: "/images/facilities/sports_complex.webp",
    alt: "Multi-Sport Athletics Arena",
    title: "Grand Sports Arena",
    subtitle: "Football turf, basketball courts & tennis academy",
    meta: [
      { label: "Category", value: "Athletics & Games" },
      { label: "Courts", value: "Basketball, Tennis, Turf" },
      { label: "Honors", value: "CBSE National Champions" },
    ],
  },
  {
    src: "/images/facilities/auditorium.webp",
    alt: "Grand Multi-Purpose Auditorium",
    title: "Grand Air-Conditioned Auditorium",
    subtitle: "1,200+ seating cultural and symposium hall",
    meta: [
      { label: "Category", value: "Arts & Culture" },
      { label: "Capacity", value: "1,200+ Seating" },
      { label: "Audio", value: "Surround Digital Acoustics" },
    ],
  },
  {
    src: "/images/facilities/library.webp",
    alt: "Central Knowledge Hub Library",
    title: "Central Digital Library",
    subtitle: "30,000+ volumes, periodicals, and e-learning pods",
    meta: [
      { label: "Category", value: "Learning Resources" },
      { label: "Collection", value: "30,000+ Books" },
      { label: "Digital", value: "Kindle & Research Databases" },
    ],
  },
  {
    src: "/images/dps/slider_2.webp",
    alt: "Times Education Icons 2024",
    title: "Times Education Award Winner",
    subtitle: "Recognized as the #1 CBSE School in Ghaziabad",
    meta: [
      { label: "Category", value: "Awards & Honors" },
      { label: "Year", value: "2024-25" },
      { label: "Ranking", value: "#1 CBSE Ghaziabad" },
    ],
  },
];

const categories = ["All", "Labs", "Sports", "Library", "Events", "Campus"];

const defaultGalleryItems = [
  { id: 1, title: "AI & Robotics Innovation Lab", category: "Labs", imageUrl: "/images/facilities/ai_robotics_lab.webp" },
  { id: 2, title: "State-of-the-Art Science Research Lab", category: "Labs", imageUrl: "/images/facilities/quantum_science_lab.webp" },
  { id: 3, title: "Interactive 4K Smart Classroom", category: "Campus", imageUrl: "/images/facilities/smart_classroom.webp" },
  { id: 4, title: "Olympic Aquatic Center", category: "Sports", imageUrl: "/images/facilities/swimming_pool.webp" },
  { id: 5, title: "Multi-Sport Athletics Arena", category: "Sports", imageUrl: "/images/facilities/sports_complex.webp" },
  { id: 6, title: "Central Digital Knowledge Hub", category: "Library", imageUrl: "/images/facilities/library.webp" },
  { id: 7, title: "Grand Auditorium & Symposium Hall", category: "Events", imageUrl: "/images/facilities/auditorium.webp" },
  { id: 8, title: "Performing Arts & Music Studio", category: "Events", imageUrl: "/images/facilities/music_dance.webp" },
  { id: 9, title: "Fine Art & Creative Design Studio", category: "Campus", imageUrl: "/images/facilities/art_craft_studio.webp" },
  { id: 10, title: "GPS-Enabled AC Transit Fleet", category: "Campus", imageUrl: "/images/facilities/transport_bus.webp" },
  { id: 11, title: "Times Education Awards 2024", category: "Events", imageUrl: "/images/dps/slider_2.webp" },
  { id: 12, title: "DPS Indirapuram Main Campus", category: "Campus", imageUrl: "/images/dps/about_us.webp" },
];

export default function Gallery() {
  const { data: legacyGallery } = trpc.gallery.list.useQuery();
  const { data: cmsGallery } = trpc.cms.listGalleryImages.useQuery();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Merge CMS images with legacy / fallback images
  const liveCmsItems = cmsGallery?.map((img: any) => ({
    id: img._id,
    title: img.title,
    category: img.category,
    imageUrl: img.imageUrl,
  })) || [];

  const displayItems = liveCmsItems.length > 0 
    ? [...liveCmsItems, ...defaultGalleryItems] 
    : (legacyGallery?.length ? legacyGallery : defaultGalleryItems);

  const filtered = selectedCategory === "All"
    ? displayItems
    : displayItems.filter((g) => g.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <Layout>
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden">
        {/* Dynamic Background Mesh Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              Interactive Campus Tour
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 tracking-tight text-white drop-shadow-md">
              3D Campus Gallery
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
              Drag, swipe, and explore the futuristic infrastructure, innovation labs, sports arenas, and vibrant life at DPS Indirapuram.
            </p>
          </div>
        </div>
      </section>

      {/* 3D COVERFLOW INTERACTIVE SHOWCASE */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              3D Coverflow Perspective
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Drag or Click to Navigate
            </h2>
          </div>

          <div className="w-full max-w-5xl mx-auto">
            <CoverflowCarousel
              slides={coverflowSlides}
              showCaption={true}
              showNavigation={true}
              showPagination={true}
              cardWidth="clamp(180px, 28vw, 320px)"
              rotate={42}
              depth={0.7}
              perspective={3.2}
              className="py-4"
              cardClassName="border-2 border-emerald-500/30 shadow-2xl rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Photo Collections
            </h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered?.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VideoGallerySection />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setSelectedImage(null)}>
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}