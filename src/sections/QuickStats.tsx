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
    <section className="py-16 bg-gradient-to-b from-slate-900 to-emerald-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-emerald-500/20 hover:border-emerald-400/50 shadow-lg hover:shadow-emerald-950/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-amber-400 mb-3 flex justify-center">
                {iconMap[stat.icon || "Award"] || <Award className="w-8 h-8" />}
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.value.includes("%") ? "%" : stat.value.includes("+") ? "+" : ""}
                />
              </h3>
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}