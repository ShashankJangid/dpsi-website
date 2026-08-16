'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full min-h-[550px] lg:h-[600px] bg-gradient-to-br from-white via-sky-50/40 to-blue-50/60 border border-sky-200/80 text-slate-900 relative overflow-hidden rounded-3xl shadow-xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(56, 189, 248, 0.15)"
      />
      
      <div className="flex flex-col lg:flex-row h-full min-h-[550px]">
        {/* Left content */}
        <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold uppercase tracking-wider mb-6 w-max shadow-2xs">
            Next-Gen AI & Robotics
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Interactive 3D <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700">Robotics & Innovation</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
            Step into the future at DPS Indirapuram. Experience immersive 3D technology, futuristic robotics simulations, and interactive learning environments built for tomorrow's leaders.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="/admissions"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all hover:scale-105"
            >
              Explore Admissions 2026-27
            </a>
            <a
              href="/facilities"
              className="px-6 py-3 rounded-xl bg-white hover:bg-sky-50 border border-sky-300 text-sky-900 font-bold text-sm shadow-2xs transition-all hover:scale-105"
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
