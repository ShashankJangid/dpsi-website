'use client'

import { Suspense, lazy, useRef, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  trackGlobalCursor?: boolean
}

export function SplineScene({ scene, className, trackGlobalCursor = true }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!trackGlobalCursor) return

    const handleGlobalMouseMove = (e: MouseEvent | PointerEvent) => {
      if (!canvasRef.current && containerRef.current) {
        canvasRef.current = containerRef.current.querySelector('canvas')
      }

      const canvas = canvasRef.current
      if (!canvas) return

      // If the mouse is directly over the canvas, native events handle it
      const rect = canvas.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!isInside) {
        // Forward synthetic pointermove so Spline runtime rotates the robot head globally
        try {
          const syntheticEvent = new PointerEvent('pointermove', {
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            bubbles: true,
            cancelable: true,
            pointerType: 'mouse',
          })
          canvas.dispatchEvent(syntheticEvent)
        } catch {
          // fallback to mousemove
          try {
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
              cancelable: true,
            })
            canvas.dispatchEvent(mouseEvent)
          } catch {
            // ignore
          }
        }
      }
    }

    window.addEventListener('pointermove', handleGlobalMouseMove, { passive: true })
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleGlobalMouseMove)
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [trackGlobalCursor])

  const handleSplineLoad = (splineApp: any) => {
    if (splineApp && splineApp.canvas) {
      canvasRef.current = splineApp.canvas
    } else if (containerRef.current) {
      canvasRef.current = containerRef.current.querySelector('canvas')
    }
  }

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className || ''}`}>
      <Suspense
        fallback={
          <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-sky-400/80 animate-pulse tracking-wide uppercase">
              Loading 3D Robot...
            </p>
          </div>
        }
      >
        <Spline
          scene={scene}
          onLoad={handleSplineLoad}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  )
}
