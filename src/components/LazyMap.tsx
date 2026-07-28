import { useState, useEffect, useRef } from "react";
import { MapPin, ExternalLink, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LazyMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRenderIframe, setShouldRenderIframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Delay iframe load slightly after page paint to keep initial load instant
          setTimeout(() => setShouldRenderIframe(true), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const googleMapsUrl = "https://maps.google.com/maps?q=Delhi%20Public%20School%20Indirapuram%20Ahinsa%20Khand%20Ghaziabad&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const externalMapsUrl = "https://www.google.com/maps/search/?api=1&query=Delhi+Public+School+Indirapuram+Ghaziabad";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md group"
    >
      {/* Light fast placeholder skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 animate-pulse">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-base mb-1">DPS Indirapuram Campus Map</h4>
          <p className="text-slate-400 text-xs max-w-xs mb-4">
            526/1, Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014
          </p>
          {!shouldRenderIframe && (
            <Button
              size="sm"
              onClick={() => setShouldRenderIframe(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Compass className="w-3.5 h-3.5 mr-1.5" /> Load Interactive Map
            </Button>
          )}
        </div>
      )}

      {/* Optimized fast iframe */}
      {shouldRenderIframe && (
        <iframe
          src={googleMapsUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          referrerPolicy="no-referrer-when-downgrade"
          title="DPS Indirapuram Google Maps Location"
          className={`w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Floating Direct Maps Button */}
      <a
        href={externalMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-emerald-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 transition-all duration-300 hover:scale-105"
      >
        <span>Open in Google Maps</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
