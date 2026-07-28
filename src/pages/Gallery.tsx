import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers } from "lucide-react";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";

const categories = ["All", "Labs", "Sports", "Library", "Events", "Campus"];

const defaultGalleryItems = [
  { id: 1, title: "Times Education Award", category: "Events", imageUrl: "https://www.dpsindirapuram.com/images/slider/815521734779591slider.png" },
  { id: 2, title: "Next-Gen AI Lab", category: "Labs", imageUrl: "https://www.dpsindirapuram.com/images/slider/815621745565959slider.png" },
  { id: 3, title: "Science & Innovation Lab", category: "Labs", imageUrl: "https://www.dpsindirapuram.com/images/slider/825591745565931slider.png" },
  { id: 4, title: "School Campus Building", category: "Campus", imageUrl: "https://www.dpsindirapuram.com/images/about-us.png" },
  { icon: "", id: 5, title: "Annual Cultural Fest", category: "Events", imageUrl: "https://www.dpsindirapuram.com/upload/event/541891784563976.jpg" },
  { id: 6, title: "Sports Meet & Athletics", category: "Sports", imageUrl: "https://www.dpsindirapuram.com/images/slider/591381671801351.png" },
  { id: 7, title: "NEET & JEE Achievers", category: "Events", imageUrl: "https://www.dpsindirapuram.com/upload/event/683291780490495.jpg" },
  { id: 8, title: "School Main Block", category: "Campus", imageUrl: "https://www.dpsindirapuram.com/images/slider/112631671546115slider.jpg" },
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