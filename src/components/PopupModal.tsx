import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  const { data: popups } = trpc.cms.listPopups.useQuery(undefined, {
    staleTime: 60000,
  });

  const activePopup = popups?.find((p: any) => p.isActive && !p.isDeleted);

  useEffect(() => {
    if (activePopup && !hasDismissed) {
      const dismissedId = sessionStorage.getItem("dpsi_popup_dismissed");
      if (dismissedId !== activePopup._id) {
        // Show after a pleasant 1.5s delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [activePopup, hasDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setHasDismissed(true);
    if (activePopup) {
      sessionStorage.setItem("dpsi_popup_dismissed", activePopup._id);
    }
  };

  if (!isOpen || !activePopup) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative max-w-lg w-full bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl shadow-emerald-950/40 text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Optional Popup Image */}
          {activePopup.imageUrl && (
            <div className="w-full h-48 sm:h-56 bg-slate-950 overflow-hidden relative">
              <img
                src={activePopup.imageUrl}
                alt={activePopup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Official Notice
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {activePopup.title}
            </h3>

            {activePopup.content && (
              <p className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                {activePopup.content}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </Button>
              {activePopup.linkUrl && (
                <Button
                  onClick={() => {
                    handleClose();
                    window.open(activePopup.linkUrl, "_blank");
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-emerald-900/30 flex items-center gap-1.5"
                >
                  Learn More <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
