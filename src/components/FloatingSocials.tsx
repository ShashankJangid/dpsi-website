import { motion } from "framer-motion";
import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="w-5 h-5" />,
    url: "https://www.facebook.com/DPSIndirapuramGhaziabad",
    color: "bg-[#1877F2] hover:bg-[#166fe5]",
  },
  {
    name: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    url: "https://www.instagram.com/dps_indirapuram/",
    color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90",
  },
  {
    name: "YouTube",
    icon: <Youtube className="w-5 h-5" />,
    url: "https://www.youtube.com/channel/UC-jQAVRh4pBXEktpml3yeIQ/videos",
    color: "bg-[#FF0000] hover:bg-[#cc0000]",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "https://www.linkedin.com/company/dpsindirapuram/",
    color: "bg-[#0A66C2] hover:bg-[#095196]",
  },
];

export default function FloatingSocials() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -14, 0, -8, 0] }}
        transition={{
          duration: 1.5,
          repeat: 2,
          repeatDelay: 4,
          ease: "easeOut",
        }}
        className="flex flex-col gap-2.5 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl p-3 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50"
      >
        {socialLinks.map((s) => (
          <motion.a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-lg transition-all duration-300 ${s.color}`}
            title={`DPS Indirapuram on ${s.name}`}
          >
            {s.icon}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
