import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";

const categories = ["All", "Labs", "Sports", "Library", "Events", "Campus"];

const defaultGalleryItems = [
  { id: 1, title: "Futuristic AI & Robotics Lab", category: "Labs", imageUrl: "/images/facilities/ai_robotics_lab.webp" },
  { id: 2, title: "Quantum Science Laboratory", category: "Labs", imageUrl: "/images/facilities/quantum_science_lab.webp" },
  { id: 3, title: "Interactive Smart Classroom", category: "Campus", imageUrl: "/images/facilities/smart_classroom.webp" },
  { id: 4, title: "Times Education Award 2024", category: "Events", imageUrl: "/images/dps/slider_2.webp" },
  { id: 5, title: "School Main Campus Building", category: "Campus", imageUrl: "/images/dps/about_us.webp" },
  { id: 6, title: "Annual Cultural & Sports Meet", category: "Sports", imageUrl: "/images/dps/slider_5.webp" },
  { id: 7, title: "NEET & JEE Top Achievers", category: "Events", imageUrl: "/images/dps/event_jeea.webp" },
  { id: 8, title: "DPS Indirapuram Block", category: "Campus", imageUrl: "/images/dps/slider_6.webp" },
];

export default function Gallery() {
  const { data: gallery } = trpc.gallery.list.useQuery();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const displayItems = gallery?.length ? gallery : defaultGalleryItems;

  const filtered = selectedCategory === "All"
    ? displayItems
    : displayItems.filter((g) => g.category === selectedCategory);

  return (
    <Layout>
      <section className="relative py-24 bg-gradient-to-br from-slate-900 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
            <p className="text-lg text-slate-300">
              A visual journey through the vibrant life at DPS Indirapuram.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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