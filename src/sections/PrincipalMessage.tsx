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
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                alt="Principal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-emerald-700 text-white p-6 rounded-xl shadow-xl">
              <p className="text-sm font-medium">Ms. Priya Elizabeth John</p>
              <p className="text-xs text-emerald-200">Principal, DPS Indirapuram</p>
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