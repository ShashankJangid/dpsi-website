import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Dynamic Animated Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span>Admissions Open 2026-27</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight text-white leading-tight">
              Begin Your Journey <br /> With DPS Indirapuram
            </h2>
            <p className="text-emerald-100/90 mb-8 text-base sm:text-lg leading-relaxed font-medium">
              Admissions are now open for the session 2026-27 (Pre-Nursery to Class IX & XI). Limited seats available. Enquire today and secure your child's future at Delhi NCR's top CBSE institution.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-amber-950/40 cursor-pointer flex items-center gap-2 text-sm"
                  asChild
                >
                  <Link to="/admissions">
                    Apply Online <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="border-2 border-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md cursor-pointer text-sm"
                  asChild
                >
                  <Link to="/contact">Contact Office</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <motion.a
              href="tel:+9101204660000"
              whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.16)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-lg cursor-pointer transition-colors block"
            >
              <div className="w-12 h-12 bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300">Direct Admission Desk</p>
                <p className="font-extrabold text-base text-white">+91-0120-4660000, 4670000</p>
              </div>
            </motion.a>

            <motion.a
              href="mailto:info@dpsindirapuram.com"
              whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.16)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-lg cursor-pointer transition-colors block"
            >
              <div className="w-12 h-12 bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300">Email Admissions Desk</p>
                <p className="font-extrabold text-base text-white">info@dpsindirapuram.com</p>
              </div>
            </motion.a>

            <motion.div
              whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.16)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-lg transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300">Campus Location</p>
                <p className="font-extrabold text-base text-white">Ahinsa Khand-II, Indirapuram, Ghaziabad</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}