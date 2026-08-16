import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Sparkles } from "lucide-react";

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
    <section className="py-28 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Animated Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/20 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1]
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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toppersList.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="h-full"
            >
              <Card className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden group h-full rounded-3xl">
                <CardContent className="p-6 text-center flex flex-col items-center justify-between h-full">
                  <div className="relative mb-5">
                    <motion.div
                      whileHover={{ rotate: 3, scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-500 shadow-xl shadow-rose-950/40"
                    >
                      <div className="w-full h-full rounded-full overflow-hidden relative bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#d97706] p-0.5">
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:10px_10px]" />
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="relative w-full h-full object-cover rounded-full mix-blend-normal z-10"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </motion.div>
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3.5 py-0.5 rounded-full shadow-xl flex items-center gap-1 border border-amber-300/40 z-20 whitespace-nowrap">
                      <Award className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{t.score}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="font-extrabold text-lg text-white group-hover:text-amber-300 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-400 mt-1">{t.class}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">CBSE Board Examination</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}