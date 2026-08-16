import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Users,
  GraduationCap,
  Network,
  Award,
  Trophy,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Network: <Network className="w-8 h-8" />,
  Award: <Award className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
};

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numericValue = parseFloat(target.replace(/[^0-9.]/g, ""));
  const isPercentage = target.includes("%");

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return;
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  if (isNaN(numericValue)) {
    return <span>{target}</span>;
  }

  const display = isPercentage ? count.toFixed(1) : Math.floor(count).toLocaleString();
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function QuickStats() {
  const { data: stats } = trpc.stats.list.useQuery();

  if (!stats?.length) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Background Animated Radial Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/15 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{
                y: -8,
                scale: 1.04,
                boxShadow: "0 20px 30px -10px rgba(16, 185, 129, 0.3)"
              }}
              className="text-center p-6 bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-emerald-500/20 hover:border-emerald-400/60 shadow-xl transition-all duration-300 group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-amber-400 mb-3 flex justify-center group-hover:text-amber-300 transition-colors"
              >
                {iconMap[stat.icon || "Award"] || <Award className="w-8 h-8" />}
              </motion.div>
              <h3 className="text-3xl font-black text-white mb-1 tracking-tight">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.value.includes("%") ? "%" : stat.value.includes("+") ? "+" : ""}
                />
              </h3>
              <p className="text-xs font-bold text-emerald-300/90 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}