import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Begin Your Journey With Us
            </h2>
            <p className="text-emerald-200 mb-8 text-lg">
              Admissions are now open for the session 2026-27. Limited seats available
              for selected classes. Enquire today and secure your child&apos;s future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-emerald-800 hover:bg-emerald-100 font-semibold"
                asChild
              >
                <Link to="/admissions">
                  Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-emerald-300">Call Us</p>
                <p className="font-semibold">+91-0120-4660000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-emerald-300">Email Us</p>
                <p className="font-semibold">info@dpsindirapuram.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-emerald-300">Visit Us</p>
                <p className="font-semibold">Ahinsa Khand-II, Indirapuram, Ghaziabad</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}