import { motion } from "framer-motion";
import { FlaskConical, BookOpen, Dumbbell, Microscope, Music, Palette, Wifi, Bus, Shield, HeartPulse } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import Facilities3D from "@/components/3d/Facilities3D";

const facilities = [
  { icon: <Microscope className="w-8 h-8" />, title: "Futuristic AI & Robotics Lab", desc: "Next-gen AI/ML research center equipped with humanoid robots, Arduino/Raspberry Pi workstations, 3D printers, and expert mentors.", image: "/images/facilities/ai_robotics_lab.webp" },
  { icon: <FlaskConical className="w-8 h-8" />, title: "Quantum Science Lab (Upcoming)", desc: "Upcoming next-generation research laboratory planned with laser optics, digital micro-analysis, and modern safety systems.", image: "/images/facilities/quantum_science_lab.webp", isUpcoming: true },
  { icon: <Wifi className="w-8 h-8" />, title: "Next-Gen Smart Classrooms", desc: "Equipped with interactive digital touchboards, ergonomic learning pods, and high-speed gigabit connectivity.", image: "/images/facilities/smart_classroom.webp" },
  { icon: <Dumbbell className="w-8 h-8" />, title: "Sports & Aquatic Complex", desc: "Olympic-size swimming pool, basketball courts, cricket ground, athletics track, and indoor badminton courts.", image: "/images/facilities/swimming_pool.webp" },
  { icon: <BookOpen className="w-8 h-8" />, title: "Digital Knowledge Library", desc: "A vast repository of 50,000+ books, digital archives, e-journals, and quiet reading spaces for focused study.", image: "/images/facilities/library.webp" },
  { icon: <Music className="w-8 h-8" />, title: "Performing Arts & Music", desc: "Professional music rooms, dance studios, and an auditorium with stage lighting and acoustics.", image: "/images/facilities/music_dance.webp" },
  { icon: <Palette className="w-8 h-8" />, title: "Art & Craft Studio", desc: "Spacious art studios for painting, sculpture, pottery, and craft with professional-grade materials.", image: "/images/facilities/art_craft_studio.webp" },
  { icon: <Bus className="w-8 h-8" />, title: "GPS AC Transportation", desc: "Fleet of 50+ GPS-enabled AC buses covering all major areas with trained drivers and attendants.", image: "/images/facilities/transport_bus.webp" },
  { icon: <Shield className="w-8 h-8" />, title: "Campus Safety & Security", desc: "24/7 CCTV surveillance, trained security personnel, fire safety systems, and emergency response protocols.", image: "/images/facilities/campus_security.webp" },
  { icon: <HeartPulse className="w-8 h-8" />, title: "Health & Medical Center", desc: "On-campus medical facility with qualified nurses, annual health checkups, and counseling services.", image: "/images/facilities/medical_infirmary.webp" },
];

export default function Facilities() {
  return (
    <Layout>
      {/* HERO SECTION WITH GUARANTEED RENDERING & CINEMATIC GLOW */}
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
              Campus Infrastructure
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 tracking-tight text-white drop-shadow-md">
              World-Class Facilities
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 mx-auto rounded-full mb-6" />
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
              Our infrastructure is designed to inspire learning, foster creativity, and ensure the holistic development of every student.
            </p>
          </div>
        </div>
      </section>

      {/* 3D INTERACTIVE FACILITIES PREVIEW */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Facilities Preview
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base font-medium">
              Click on the cards to explore our key facilities in 3D
            </p>
          </motion.div>
          <Facilities3D />
        </div>
      </section>

      {/* INFRASTRUCTURE GRID */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Our Infrastructure
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mt-3 rounded-full" />
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base font-medium max-w-xl mx-auto">
              Equipped with state-of-the-art labs, sports grounds, creative spaces, and safety measures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="h-full"
              >
                <Card className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 group h-full flex flex-col justify-between bg-white dark:bg-slate-900">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="w-10 h-10 bg-emerald-600/90 backdrop-blur-md rounded-xl flex items-center justify-center mb-2 shadow-md">
                        {f.icon}
                      </div>
                      <h3 className="font-extrabold text-lg leading-snug">{f.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
                    {f.isUpcoming && (
                      <span className="mt-3 inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold w-max border border-amber-500/20">
                        Upcoming Facility
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}