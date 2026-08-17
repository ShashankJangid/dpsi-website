import { motion } from "framer-motion";
import { Link } from "react-router";
import { CalendarDays, Clock, ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { trpc } from "@/providers/trpc";

export default function NewsEvents() {
  const { data: news } = trpc.news.list.useQuery();
  const { data: events } = trpc.events.all.useQuery();

  return (
    <Layout>
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white overflow-hidden">
        {/* Dynamic Background Mesh Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              Press Releases & Activity Logs
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 tracking-tight text-white drop-shadow-md">
              News & Events
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
              Stay updated with the latest happenings, achievements, and upcoming events at DPS Indirapuram.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-10">
              <TabsTrigger value="news" className="flex-1">Latest News</TabsTrigger>
              <TabsTrigger value="events" className="flex-1">Upcoming Events</TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news?.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img src={item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80"} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">{item.category || "News"}</span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.excerpt || item.content.slice(0, 150)}</p>
                        <Link to={`/news/${item.slug}`} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.map((event, i) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img src={event.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80"} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 rounded-lg p-2 text-center min-w-[60px]">
                          <span className="block text-xl font-bold text-emerald-700 dark:text-emerald-400">{new Date(event.eventDate).getDate()}</span>
                          <span className="block text-[10px] uppercase text-muted-foreground">{new Date(event.eventDate).toLocaleString("default", { month: "short" })}</span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(event.eventDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}