import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star } from "lucide-react";

const toppersList = [
  {
    name: "Siddhant Tiwari",
    class: "Class X",
    score: "99.4%",
    photo: "/images/dps/topper_siddhant.webp"
  },
  {
    name: "Ansh Pathak",
    class: "Class X",
    score: "99.4%",
    photo: "/images/dps/topper_ansh.webp"
  },
  {
    name: "Aayush Jha",
    class: "Class X",
    score: "99.2%",
    photo: "/images/dps/topper_aayush.webp"
  },
  {
    name: "Arnav Jha",
    class: "Class X",
    score: "99.2%",
    photo: "/images/dps/topper_arnav.webp"
  },
  {
    name: "Jia Manchanda",
    class: "Class XII (Commerce)",
    score: "98.2%",
    photo: "/images/dps/topper_jia.webp"
  },
  {
    name: "Snigdha Shukla",
    class: "Class XII (Humanities)",
    score: "97.6%",
    photo: "/images/dps/topper_snigdha.webp"
  },
  {
    name: "Pawni Srivastava",
    class: "Class XII (Science)",
    score: "97.2%",
    photo: "/images/dps/topper_pawni.webp"
  }
];

export default function AchievementsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Academic Excellence</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Class X & XII <span className="text-gradient-gold">Toppers</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Celebrating outstanding academic achievements in CBSE Board Examinations. Our dipsites continue to set benchmark results nationwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toppersList.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-950/60 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-5 text-center flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-amber-500 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-full h-full object-cover rounded-full bg-slate-800"
                      />
                    </div>
                    <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                      <Award className="w-3 h-3 fill-slate-950" />
                      <span>{t.score}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors mt-2">
                    {t.name}
                  </h3>
                  <p className="text-xs font-medium text-emerald-400 mt-1">{t.class}</p>
                  <p className="text-[11px] text-slate-400 mt-1">CBSE Board Exam</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}