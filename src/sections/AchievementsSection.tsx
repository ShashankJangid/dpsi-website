import { motion } from "framer-motion";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { trpc } from "@/providers/trpc";

export default function AchievementsSection() {
  const { data: achievements, isLoading } = trpc.achievements.list.useQuery();

  const slides: CoverflowSlide[] = (achievements || []).map((ach: any) => ({
    src: ach.imageUrl || ach.image || "/images/dps/topper_siddhant.webp",
    alt: ach.studentName,
    title: `${ach.studentName} • ${ach.score}`,
    subtitle: `${ach.className || ach.class} • ${ach.exam || "CBSE Board Examination"}`,
    meta: [
      { label: "Rank", value: ach.rank || ach.stream || "#1 Rank" },
      { label: "Score", value: `${ach.score} Aggregate` },
      { label: "Year", value: ach.year || "2025-26" },
    ],
  }));

  if (!isLoading && slides.length === 0) {
    return null;
  }

  return (
    <section className="py-24 sm:py-28 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Animated Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span>Academic Excellence</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight text-white">
            Class X & XII <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">Toppers</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Celebrating outstanding academic achievements in CBSE Board Examinations. Our dipsites continue to set benchmark results nationwide.
          </p>
        </motion.div>

        {/* 3D COVERFLOW SHOWCASE FOR TOPPERS */}
        {slides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto py-2"
          >
            <CoverflowCarousel
              slides={slides}
              showCaption={true}
              showNavigation={true}
              showPagination={true}
              cardWidth="clamp(180px, 26vw, 290px)"
              rotate={42}
              depth={0.7}
              perspective={3.2}
              className="py-2 text-white"
              cardClassName="border-2 border-amber-400/50 shadow-2xl rounded-3xl bg-slate-900 ring-2 ring-amber-500/20"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}