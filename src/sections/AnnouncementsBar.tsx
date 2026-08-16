import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Megaphone } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function AnnouncementsBar() {
  const { data: announcements } = trpc.announcements.list.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!announcements?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements?.length) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white py-2 px-4 relative overflow-hidden shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Megaphone className="w-4 h-4 shrink-0 text-amber-200" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide"
          >
            <span>{current.title}</span>
            {current.link && (
              <Link
                to={current.link}
                className="inline-flex items-center gap-1 text-white underline underline-offset-4 hover:text-amber-100 font-bold ml-1"
              >
                Know More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}