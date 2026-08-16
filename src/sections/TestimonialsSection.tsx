import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";

export default function TestimonialsSection() {
  const { data: testimonials } = trpc.testimonials.featured.useQuery();
  const [current, setCurrent] = useState(0);

  if (!testimonials?.length) return null;

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-sky-50/40 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Parent & Alumni Voices
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What They Say About Us
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                else if (info.offset.x > 50) prev();
              }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 text-center cursor-grab active:cursor-grabbing relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xs">
                <Quote className="w-7 h-7" />
              </div>
              <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed mb-8 font-medium italic select-none">
                "{testimonials[current].content}"
              </p>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                  {testimonials[current].name}
                </h4>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs mt-1 uppercase tracking-wider">
                  {testimonials[current].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full w-10 h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                title="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  animate={{
                    width: i === current ? 24 : 8,
                    backgroundColor: i === current ? "#059669" : "rgba(148, 163, 184, 0.5)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="h-2 rounded-full cursor-pointer"
                  title={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full w-10 h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md cursor-pointer"
                title="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}