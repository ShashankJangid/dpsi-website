import { motion } from "framer-motion";
import { FlaskConical, BookOpen, Dumbbell, Microscope, Music, Palette, Wifi, Bus, Shield, HeartPulse } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import Facilities3D from "@/components/3d/Facilities3D";

const facilities = [
  { icon: <FlaskConical className="w-8 h-8" />, title: "Science Laboratories", desc: "8 state-of-the-art labs for Physics, Chemistry, Biology, and Biotechnology equipped with modern apparatus and safety systems.", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80" },
  { icon: <BookOpen className="w-8 h-8" />, title: "Digital Library", desc: "A vast repository of 50,000+ books, digital archives, e-journals, and quiet reading spaces for focused study.", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80" },
  { icon: <Dumbbell className="w-8 h-8" />, title: "Sports Complex", desc: "Olympic-size swimming pool, basketball courts, cricket ground, athletics track, and indoor badminton courts.", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
  { icon: <Microscope className="w-8 h-8" />, title: "AI & Robotics Lab", desc: "Cutting-edge AI/ML research center with 3D printers, robotic kits, and dedicated mentors for innovation.", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80" },
  { icon: <Music className="w-8 h-8" />, title: "Performing Arts", desc: "Professional music rooms, dance studios, and an auditorium with stage lighting and acoustics.", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80" },
  { icon: <Palette className="w-8 h-8" />, title: "Art Studio", desc: "Spacious art studios for painting, sculpture, pottery, and craft with professional-grade materials.", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80" },
  { icon: <Wifi className="w-8 h-8" />, title: "Smart Classrooms", desc: "Every classroom equipped with interactive whiteboards, projectors, and high-speed internet connectivity.", image: "https://images.unsplash.com/photo-1509062522246-1c4c7583a9ca?w=600&q=80" },
  { icon: <Bus className="w-8 h-8" />, title: "Transportation", desc: "Fleet of 50+ GPS-enabled AC buses covering all major areas with trained drivers and attendants.", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80" },
  { icon: <Shield className="w-8 h-8" />, title: "Safety & Security", desc: "24/7 CCTV surveillance, trained security personnel, fire safety systems, and emergency response protocols.", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80" },
  { icon: <HeartPulse className="w-8 h-8" />, title: "Health Center", desc: "On-campus medical facility with qualified nurses, annual health checkups, and counseling services.", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80" },
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