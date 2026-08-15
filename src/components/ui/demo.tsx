'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full min-h-[550px] lg:h-[600px] bg-slate-950/[0.96] border border-slate-800 text-white relative overflow-hidden rounded-3xl shadow-2xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
      />
      
      <div className="flex flex-col lg:flex-row h-full min-h-[550px]">
        {/* Left content */}
        <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 w-max">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Next-Gen AI & Robotics
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 leading-tight">
            Interactive 3D Robotics & Innovation
          </h1>
          <p className="mt-4 text-neutral-300 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
            Step into the future at DPS Indirapuram. Experience immersive 3D technology, futuristic robotics simulations, and interactive learning environments built for tomorrow's leaders.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="/admissions"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Explore Admissions 2026-27
            </a>
            <a
              href="/facilities"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Visit AI Labs
            </a>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[350px] lg:min-h-full w-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
