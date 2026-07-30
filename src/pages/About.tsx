import { motion } from "framer-motion";
import { Target, Eye, Heart, BookOpen, Users, Award } from "lucide-react";
import Layout from "@/components/Layout";

const values = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Excellence",
    desc: "Striving for the highest standards in education and character development.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Integrity",
    desc: "Building honest, ethical individuals who lead with moral courage.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Inclusivity",
    desc: "Celebrating diversity and creating a welcoming environment for all.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Innovation",
    desc: "Embracing new ideas and technologies to prepare students for the future.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Resilience",
    desc: "Developing grit and perseverance to overcome challenges with confidence.",
  },
];

const leadership = [
  {
    name: "Ms. Priya Elizabeth John",
    role: "Principal, DPS Indirapuram",
    image: "/images/leadership/priya_john.webp",
  },
  {
    name: "Ms. Santosh Bansal",
    role: "Pro-Vice Chairperson",
    image: "/images/leadership/santosh_bansal.webp",
  },
  {
    name: "Mr. V.K. Shunglu",
    role: "Chairman, DPS Society & Chairman, Managing Committee, DPS Indirapuram",
    image: "/images/leadership/vk_shunglu.webp",
  },
];

const timeline = [
  { year: "2003", title: "Foundation", desc: "DPS Indirapuram established under the DPS Society." },
  { year: "2008", title: "CBSE Affiliation", desc: "Granted permanent CBSE affiliation with exemplary inspection results." },
  { year: "2012", title: "First Batch Success", desc: "100% CBSE results with multiple students scoring above 95%." },
  { year: "2015", title: "Sports Complex", desc: "National-level sports complex and aquatic center inaugurated." },
  { year: "2021", title: "Digital Transformation", desc: "Complete digital infrastructure upgrade for modern learning." },
  { year: "2023", title: "20th Anniversary", desc: "Celebrated 20 years of academic excellence and holistic development." },
  { year: "2024", title: "AI & Robotics Lab", desc: "State-of-the-art AI & Robotics innovation center inaugurated with 3D printers and humanoid kits." },
  { year: "2025", title: "Global Recognition", desc: "Ranked among top CBSE schools in India with British Council International Dimension Award." },
];

export default function About() {
  return (
    <Layout>
      <section className="relative py-24 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our School</h1>
            <p className="text-lg text-emerald-200 leading-relaxed">
              Delhi Public School Indirapuram, established in 2003, is a premier institution
              under the DPS Society. We are committed to nurturing young minds through holistic
              education that blends academic rigor with creative expression.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="vision" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center text-white mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To be a world-class institution that nurtures young minds into responsible global
                citizens, equipped with the knowledge, skills, and values to lead and innovate
                in an ever-changing world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-8"
            >
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center text-white mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide a stimulating learning environment that fosters academic excellence,
                physical fitness, emotional well-being, and social responsibility through
                innovative pedagogy and state-of-the-art infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="leadership" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Leadership</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Guided by visionary leaders who bring decades of experience in education and administration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-xl transition-all text-center flex flex-col items-center group"
              >
                <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/30 shadow-md group-hover:scale-105 transition-transform duration-500 bg-slate-900">
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">{l.name}</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed px-2">{l.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" className="py-20 bg-emerald-50 dark:bg-emerald-950/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Journey</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full" />
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-300 dark:bg-emerald-800 md:-translate-x-px" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 md:-translate-x-2 mt-1.5 z-10" />
                <div className="ml-12 md:ml-0 md:w-1/2">
                  <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm ${
                    i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                  }`}>
                    <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-full mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}