'use client'

import { motion } from "framer-motion";
import { Link } from "react-router";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Bot, Cpu, ShieldCheck, Zap } from "lucide-react";

export function SplineSceneBasic() {
  return (
    <div className="relative w-full min-h-[700px] lg:min-h-[850px] flex items-center justify-between overflow-visible">
      {/* Background ambient lighting and spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(56, 189, 248, 0.25)"
      />

      {/* Floating Ambient Glowing Mesh Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Full-width responsive container */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10">
        {/* Left Content Area - Elevated Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xl py-4 lg:py-10 pointer-events-auto z-20"
        >
          {/* Lab Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-800 dark:text-sky-300 text-xs font-black uppercase tracking-wider mb-5 shadow-xs backdrop-blur-md">
            <Bot className="w-4 h-4 text-sky-500 animate-pulse" />
            <span>Next-Gen AI & Robotics Lab</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]">
            Interactive 3D <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300">
              Robotics & AI Lab
            </span>
          </h1>

          <p className="mt-5 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            Step into the future at DPS Indirapuram. Move your mouse anywhere on the screen to interact with our 3D AI Robot in real-time WebGL space.
          </p>

          {/* Interactive Feature Pills */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Humanoid Robotics
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-sky-500" /> Quadruped Robot Dogs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> C-Block 3rd Floor
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/admissions"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-600/30 transition-all flex items-center gap-2 group"
              >
                <span>Explore Admissions 2026-27</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/facilities"
                className="px-6 py-3.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Visit AI Labs</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Giant Full-Screen 3D Robot - High-Scale Freedom & Global Tracking */}
        <div className="flex-1 w-full min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] relative flex items-center justify-center pointer-events-auto">
          {/* Subtle Glow behind the Robot */}
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-blue-500/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Massive 3D Spline Scene filling entire container */}
          <div className="w-full h-full min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] relative flex items-center justify-center">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              trackGlobalCursor={true}
              className="w-full h-full scale-120 sm:scale-130 md:scale-140 lg:scale-150 xl:scale-160 transform-gpu origin-center"
            />
          </div>

          {/* Floating Interactive Status Indicator */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-sky-400/40 shadow-2xl flex items-center gap-2.5 pointer-events-none z-20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-slate-900 dark:text-white tracking-wide">
              3D AI Robot • Realtime Tracking
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
