import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Clean production/dev console by filtering known benign framework/3D warnings
export function setupCleanConsole() {
  if (typeof window === "undefined") return

  const originalWarn = console.warn
  const originalError = console.error

  console.warn = (...args: unknown[]) => {
    const text = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
    if (
      text.includes("Multiple instances of Three.js") ||
      text.includes("THREE.WebGLRenderer") ||
      text.includes("THREE.Warning") ||
      text.includes("was preloaded using link preload") ||
      text.includes("apple-mobile-web-app-capable") ||
      text.includes("Fast refresh only works")
    ) {
      return
    }
    originalWarn.apply(console, args)
  }

  console.error = (...args: unknown[]) => {
    const text = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
    if (
      text.includes("Multiple instances of Three.js") ||
      text.includes("apple-mobile-web-app-capable") ||
      text.includes("was preloaded using link preload")
    ) {
      return
    }
    originalError.apply(console, args)
  }
}