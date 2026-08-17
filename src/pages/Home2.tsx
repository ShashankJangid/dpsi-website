import Layout from "@/components/Layout";
import AnnouncementsBar from "@/sections/AnnouncementsBar";
import QuickStats from "@/sections/QuickStats";
import NewsHighlights from "@/sections/NewsHighlights";
import PrincipalMessage from "@/sections/PrincipalMessage";
import AchievementsSection from "@/sections/AchievementsSection";
import VideoGallerySection from "@/sections/VideoGallerySection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import CTASection from "@/sections/CTASection";
import { SplineSceneBasic } from "@/components/ui/demo";
import { motion } from "framer-motion";
import { Bot, Cpu, Rocket } from "lucide-react";
import { Link } from "react-router";

export default function Home2() {
  return (
    <Layout>
      <AnnouncementsBar />
      
      {/* UNBOXED 3D ROBOTICS HERO SECTION */}
      <section className="w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white border-b border-sky-200/50 dark:border-slate-800 relative overflow-hidden">
        {/* Ambient Top Glow Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header intro badge */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-300 text-xs font-black tracking-wider uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                Home 2.0 • 3D Spatial Experience
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold hidden sm:inline-block">
                Move cursor anywhere to interact with the 3D Robot
              </span>
            </div>

            <Link
              to="/"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              Switch to Classic Home →
            </Link>
          </div>

          {/* Unboxed Spline 3D Component */}
          <SplineSceneBasic />

          {/* Quick 3D Tech Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-200/80 dark:border-slate-800 shadow-lg backdrop-blur-xl flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Humanoid Robotics</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">AI Lab • C-Block 3rd Floor</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/80 dark:border-slate-800 shadow-lg backdrop-blur-xl flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">MakerSpace Lab</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Flight Simulators • A-Block 2nd Fl</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-emerald-200/80 dark:border-slate-800 shadow-lg backdrop-blur-xl flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Next-Gen Curriculum</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">STEAM & Experiential Learning</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE WEBSITE SECTIONS */}
      <QuickStats />
      <NewsHighlights />
      <PrincipalMessage />
      <AchievementsSection />
      <VideoGallerySection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
}
