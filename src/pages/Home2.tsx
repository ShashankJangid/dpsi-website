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
import { Sparkles, Bot, Cpu, Rocket } from "lucide-react";

export default function Home2() {
  return (
    <Layout>
      <AnnouncementsBar />
      
      {/* Interactive 3D Spline Scene Hero Banner Section */}
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header intro badge */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Home 2.0 Experience
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline-block">
                Interactive 3D Robotics & WebGL Interface
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-emerald-400">Live 3D View</span>
            </div>
          </div>

          {/* Spline 3D Component */}
          <SplineSceneBasic />

          {/* Quick 3D Tech Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Humanoid Robotics</h4>
                <p className="text-xs text-slate-400">AI Lab C-Block 3rd Floor</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">MakerSpace Lab</h4>
                <p className="text-xs text-slate-400">Flight Simulators & IoT (A-Block 2nd Fl)</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Smart Innovation</h4>
                <p className="text-xs text-slate-400">Next-Gen STEAM Curriculum</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
