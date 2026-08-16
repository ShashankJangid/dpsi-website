import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, GraduationCap, CalendarDays, MapPin, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";

export default function PrincipalMessage() {
  const { data: events } = trpc.events.list.useQuery();

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative Floating Quote Watermark */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 pointer-events-none text-emerald-600 dark:text-emerald-400 -z-0"
      >
        <Quote className="w-64 h-64" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-emerald-500/20 p-2 relative group"
            >
              <img
                src="/images/dps/student_astronaut.webp"
                alt="DPS Indirapuram Student & AI Innovation"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="absolute -bottom-6 -right-4 sm:-right-6 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-2xl text-white p-5 rounded-2xl shadow-2xl border border-emerald-400/40 shadow-emerald-950/40"
            >
              <p className="text-base font-extrabold text-amber-300 tracking-tight drop-shadow-xs">Ms. Priya Elizabeth John</p>
              <p className="text-xs font-semibold text-slate-100 mt-0.5">Principal, DPS Indirapuram</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-6 border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
              <GraduationCap className="w-4 h-4" />
              Principal's Message
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Nurturing Future Leaders
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Welcome to Delhi Public School Indirapuram, where we believe in empowering
                every child to discover their unique potential. Our institution stands as a
                beacon of excellence, combining traditional values with modern educational
                approaches.
              </p>
              <p>
                With over two decades of legacy, we have consistently delivered outstanding
                academic results while fostering creativity, critical thinking, and character
                building. Our state-of-the-art facilities and dedicated faculty ensure that
                every student receives the best possible education.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-max mt-8">
              <Button
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-700/25 cursor-pointer"
                asChild
              >
                <Link to="/about">
                  Read Full Message <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {events && events.length > 0 && (
          <div className="mt-24">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white rounded-xl flex flex-col items-center justify-center shrink-0 shadow-md">
                    <span className="text-lg font-black leading-none">
                      {new Date(event.eventDate).getDate()}
                    </span>
                    <span className="text-[10px] font-bold uppercase mt-0.5">
                      {new Date(event.eventDate).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5 font-medium">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {new Date(event.eventDate).toLocaleDateString()}
                      <MapPin className="w-3.5 h-3.5 ml-1 text-emerald-600 dark:text-emerald-400" />
                      {event.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}