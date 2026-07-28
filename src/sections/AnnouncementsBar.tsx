import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
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
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Megaphone className="w-5 h-5 shrink-0" />
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <span>{current.title}</span>
          {current.link && (
            <Link
              to={current.link}
              className="inline-flex items-center gap-1 text-white/90 hover:text-white underline underline-offset-2"
            >
              Know More <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}