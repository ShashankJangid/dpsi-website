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

export default function Home2() {
  return (
    <Layout>
      <AnnouncementsBar />
      
      {/* Interactive 3D Spline Scene Hero Banner Section (Light Color Theme) */}
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 via-slate-50 to-white text-slate-900 border-b border-sky-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header intro badge */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-extrabold tracking-wide uppercase shadow-2xs">
                Home 2.0 Experience
              </span>
              <span className="text-xs text-slate-600 font-semibold hidden sm:inline-block">
                Interactive 3D Robotics & WebGL Interface
              </span>
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
              className="p-4 rounded-2xl bg-white/95 border border-sky-200/80 shadow-md backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shrink-0 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Humanoid Robotics</h4>
                <p className="text-xs text-slate-500 font-medium">AI Lab C-Block 3rd Floor</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-4 rounded-2xl bg-white/95 border border-sky-200/80 shadow-md backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shrink-0 shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">MakerSpace Lab</h4>
                <p className="text-xs text-slate-500 font-medium">Flight Simulators & IoT (A-Block 2nd Fl)</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-4 rounded-2xl bg-white/95 border border-sky-200/80 shadow-md backdrop-blur-md flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Smart Innovation</h4>
                <p className="text-xs text-slate-500 font-medium">Next-Gen STEAM Curriculum</p>
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
