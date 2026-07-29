import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, GraduationCap, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";

export default function PrincipalMessage() {
  const { data: events } = trpc.events.list.useQuery();

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-emerald-500/20 p-2">
              <img
                src="/images/dps/about_us.webp"
                alt="DPS Indirapuram Campus"
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-slate-900/88 dark:bg-slate-950/88 backdrop-blur-2xl text-white p-5 rounded-2xl shadow-2xl border border-emerald-400/40 shadow-emerald-950/40">
              <p className="text-base font-extrabold text-amber-300 tracking-tight drop-shadow-xs">Ms. Priya Elizabeth John</p>
              <p className="text-xs font-semibold text-slate-100 mt-0.5">Principal, DPS Indirapuram</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Principal's Message
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Nurturing Future Leaders
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
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
            <Button
              className="mt-8 bg-emerald-700 hover:bg-emerald-800"
              asChild
            >
              <Link to="/about">
                Read Full Message <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {events && events.length > 0 && (
          <div className="mt-20">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl"
                >
                  <div className="w-14 h-14 bg-emerald-700 text-white rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-bold">
                      {new Date(event.eventDate).getDate()}
                    </span>
                    <span className="text-[10px] uppercase">
                      {new Date(event.eventDate).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(event.eventDate).toLocaleDateString()}
                      <MapPin className="w-3 h-3 ml-1" />
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