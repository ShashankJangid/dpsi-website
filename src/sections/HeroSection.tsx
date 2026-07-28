import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero3D from "@/components/3d/Hero3D";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <Hero3D />

      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Admissions Open for 2026-27</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Welcome to{" "}
            <span className="text-emerald-400">DPS Indirapuram</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
            Soaring High... We reach for the sky! Experience world-class education
            with state-of-the-art facilities, expert faculty, and a nurturing
            environment for holistic development.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8"
              asChild
            >
              <Link to="/admissions">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8"
              asChild
            >
              <Link to="/about">Explore More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}