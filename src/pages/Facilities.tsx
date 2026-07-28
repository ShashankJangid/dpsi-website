import { motion } from "framer-motion";
import { FlaskConical, BookOpen, Dumbbell, Microscope, Music, Palette, Wifi, Bus, Shield, HeartPulse } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import Facilities3D from "@/components/3d/Facilities3D";

const facilities = [
  { icon: <Microscope className="w-8 h-8" />, title: "Futuristic AI & Robotics Lab", desc: "Next-gen AI/ML research center equipped with humanoid robots, holographic code stations, 3D printers, and expert mentors.", image: "/images/facilities/ai_robotics_lab.webp" },
  { icon: <FlaskConical className="w-8 h-8" />, title: "Quantum Science & Physics Lab", desc: "State-of-the-art research laboratories equipped with laser optics, digital micro-analysis, and modern safety systems.", image: "/images/facilities/quantum_science_lab.webp" },
  { icon: <Wifi className="w-8 h-8" />, title: "Next-Gen Smart Classrooms", desc: "Equipped with interactive AR/VR learning pods, curved glass touchboards, and high-speed gigabit connectivity.", image: "/images/facilities/smart_classroom.webp" },
  { icon: <Dumbbell className="w-8 h-8" />, title: "Sports & Aquatic Complex", desc: "Olympic-size swimming pool, basketball courts, cricket ground, athletics track, and indoor badminton courts.", image: "/images/dps/slider_5.webp" },
  { icon: <BookOpen className="w-8 h-8" />, title: "Digital Knowledge Library", desc: "A vast repository of 50,000+ books, digital archives, e-journals, and quiet reading spaces for focused study.", image: "/images/dps/about_us.webp" },
  { icon: <Music className="w-8 h-8" />, title: "Performing Arts & Music", desc: "Professional music rooms, dance studios, and an auditorium with stage lighting and acoustics.", image: "/images/dps/slider_6.webp" },
  { icon: <Palette className="w-8 h-8" />, title: "Art & Craft Studio", desc: "Spacious art studios for painting, sculpture, pottery, and craft with professional-grade materials.", image: "/images/dps/event_neet.webp" },
  { icon: <Bus className="w-8 h-8" />, title: "GPS AC Transportation", desc: "Fleet of 50+ GPS-enabled AC buses covering all major areas with trained drivers and attendants.", image: "/images/dps/event_neet2.webp" },
  { icon: <Shield className="w-8 h-8" />, title: "Campus Safety & Security", desc: "24/7 CCTV surveillance, trained security personnel, fire safety systems, and emergency response protocols.", image: "/images/dps/event_jeea.webp" },
  { icon: <HeartPulse className="w-8 h-8" />, title: "Health & Medical Center", desc: "On-campus medical facility with qualified nurses, annual health checkups, and counseling services.", image: "/images/dps/international_logo.webp" },
];

export default function Facilities() {
  return (
    <Layout>
      <section className="relative py-24 bg-gradient-to-br from-slate-900 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">World-Class Facilities</h1>
            <p className="text-lg text-slate-300">
              Our infrastructure is designed to inspire learning, foster creativity, and ensure the holistic development of every student.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Interactive Facilities Preview</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
            <p className="text-muted-foreground mt-3">Click on the cards to explore our key facilities</p>
          </motion.div>
          <Facilities3D />
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Our Infrastructure</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={f.image} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="w-10 h-10 bg-emerald-600/90 rounded-lg flex items-center justify-center mb-2">
                        {f.icon}
                      </div>
                      <h3 className="font-bold text-lg">{f.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
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