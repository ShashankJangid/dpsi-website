import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Megaphone } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function AnnouncementsBar() {
  const { data: cmsMarquees } = trpc.cms.listMarquees.useQuery();
  const { data: legacyAnnouncements } = trpc.announcements.list.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  const dynamicMarquees = cmsMarquees
    ?.filter((m: any) => !m.isDeleted && m.isActive !== false)
    ?.map((m: any) => ({
      id: m._id?.toString() || m._id,
      title: m.text,
      link: m.linkUrl || "",
      bgColor: m.bgColor,
      textColor: m.textColor,
      badgeText: m.badgeText,
      isTransparent: !!m.isTransparent,
      shape: m.shape || "rectangle",
      borderRadius: m.borderRadius || "none",
    }));

  const items = (dynamicMarquees && dynamicMarquees.length > 0)
    ? dynamicMarquees
    : (legacyAnnouncements && legacyAnnouncements.length > 0)
    ? legacyAnnouncements.map((a: any) => ({
        id: a.id || a._id,
        title: a.title,
        link: a.link || "",
        bgColor: undefined,
        textColor: undefined,
        badgeText: undefined,
        isTransparent: false,
        shape: "rectangle",
        borderRadius: "none",
      }))
    : [];

  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  const safeIndex = currentIndex % items.length;
  const current = items[safeIndex];
  if (!current) return null;

  const radiusClass =
    current.borderRadius === "full" || current.shape === "pill"
      ? "rounded-full"
      : current.borderRadius === "xl"
      ? "rounded-2xl"
      : current.borderRadius === "md"
      ? "rounded-lg"
      : "rounded-none";

  return (
    <div
      className={`py-2 px-4 relative overflow-hidden shadow-xs transition-all duration-500 ${radiusClass}`}
      style={{
        backgroundColor: current.isTransparent ? "transparent" : current.bgColor || "#047857",
        color: current.textColor || (current.isTransparent ? "#0f172a" : "#ffffff"),
        ...(current.isTransparent
          ? {
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(8px)",
            }
          : {}),
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Megaphone className="w-4 h-4 shrink-0 opacity-80" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + safeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-center"
            style={{ color: current.textColor || (current.isTransparent ? "#0f172a" : "#ffffff") }}
          >
            {current.badgeText && (
              <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 ${current.borderRadius === "none" ? "rounded-none" : "rounded"} bg-black/20 shrink-0`}>
                {current.badgeText}
              </span>
            )}
            <span>{current.title}</span>

            {current.link && (
              <Link
                to={current.link}
                className="inline-flex items-center gap-1 underline underline-offset-4 hover:opacity-80 font-bold ml-1 shrink-0"
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