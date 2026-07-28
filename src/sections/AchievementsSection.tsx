import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";

export default function AchievementsSection() {
  const { data: achievements } = trpc.achievements.featured.useQuery();

  if (!achievements?.length) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Star Achievers</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
          <p className="text-emerald-200 mt-4 max-w-2xl mx-auto">
            Celebrating excellence in academics and beyond. Our students continue to shine at national and international levels.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.slice(0, 10).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/20 transition-colors overflow-hidden">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {a.studentName.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{a.studentName}</h4>
                  <p className="text-xs text-emerald-300 mb-1">{a.class}</p>
                  <p className="text-lg font-bold text-amber-400">{a.score}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}