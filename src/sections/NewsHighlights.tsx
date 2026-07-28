import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";

export default function NewsHighlights() {
  const { data: news } = trpc.news.featured.useQuery();

  if (!news?.length) return null;

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Latest Highlights
            </h2>
            <div className="w-16 h-1 bg-emerald-500 mt-3 rounded-full" />
          </motion.div>
          <Link
            to="/news-events"
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                      {item.category || "News"}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Admin
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.excerpt || item.content.slice(0, 120)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}