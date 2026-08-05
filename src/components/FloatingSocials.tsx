import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Youtube, Linkedin, Instagram, X, Globe } from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: "https://www.facebook.com/DPSIndirapuramGhaziabad",
    color: "bg-[#1877F2] hover:bg-[#166fe5]",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: "https://www.instagram.com/dps_indirapuram/",
    color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90",
  },
  {
    name: "YouTube",
    icon: <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: "https://www.youtube.com/channel/UC-jQAVRh4pBXEktpml3yeIQ/videos",
    color: "bg-[#FF0000] hover:bg-[#cc0000]",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: "https://www.linkedin.com/company/dpsindirapuram/",
    color: "bg-[#0A66C2] hover:bg-[#095196]",
  },
];

export default function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);
  const userInteractedRef = useRef(false);

  // Auto popup trigger: opens after 2.5s and automatically closes after 4.5s
  useEffect(() => {
    const openTimer = setTimeout(() => {
      if (!userInteractedRef.current) {
        setIsOpen(true);
      }
    }, 2500);

    const closeTimer = setTimeout(() => {
      if (!userInteractedRef.current) {
        setIsOpen(false);
      }
    }, 7000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleToggle = () => {
    userInteractedRef.current = true;
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-[74px] right-4 sm:bottom-[86px] sm:right-6 z-[99998] flex flex-col items-end gap-2 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 bg-gradient-to-br from-[#fce7f3] via-[#e2e8f0] to-[#ffedd5] backdrop-blur-2xl p-2.5 sm:p-3 rounded-2xl border border-white/60 shadow-2xl shadow-slate-900/25 mb-1"
          >
            {socialLinks.map((s) => (
              <motion.a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, rotate: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center shadow-md transition-all duration-300 ${s.color}`}
                title={`DPS Indirapuram on ${s.name}`}
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Peach Ash Grey Gradient Floating Socials Button (Icon Only - Just Symbol) */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#fce7f3] via-[#e2e8f0] to-[#ffedd5] text-slate-900 shadow-2xl shadow-slate-900/25 border border-white/80 backdrop-blur-2xl flex items-center justify-center transform-gpu will-change-transform hover:-translate-y-0.5 hover:shadow-slate-900/40 transition-all duration-300 cursor-pointer"
        title="Social Media Links"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md shrink-0">
          {isOpen ? <X className="w-4 h-4 text-white" /> : <Globe className="w-4 h-4 text-white" />}
        </div>
      </motion.button>
    </div>
  );
}
