import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageSquare, GraduationCap, Award } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  text: string;
  timestamp?: string;
  isStreaming?: boolean;
}

// Advanced Knowledge Base for DPS Indirapuram
const KNOWLEDGE_BASE: { keywords: string[]; topic: string; answer: string }[] = [
  {
    topic: "Admissions 2026-27",
    keywords: ["admiss", "apply", "join", "register", "nursery", "prep", "class 1", "admission date", "form", "entry"],
    answer: "Admissions 2026-27 are open for Pre-Nursery to Class IX & XI. You can register online via the official SchoolsOS Portal (https://dpsindp.schoolforschools.ai/login). Required documents include Birth Certificate, Transfer Certificate, last report card, and passport photos. For help, call +91-0120-4660000 or email info@dpsindirapuram.com."
  },
  {
    topic: "Fee Structure & Payment",
    keywords: ["fee", "cost", "charge", "payment", "installment", "structure", "dues", "tuition"],
    answer: "Detailed fee schedules for Pre-Nursery to Class XII are available on the official portal (https://dpsindp.schoolforschools.ai/login). Fees can be paid quarterly online. For fee desk queries, email info@dpsindirapuram.com or call +91-0120-4660000."
  },
  {
    topic: "Class XI Streams",
    keywords: ["stream", "class 11", "class 10", "class 12", "subject", "science", "commerce", "humanities", "arts", "pcm", "pcb", "biotech"],
    answer: "DPS Indirapuram offers 3 senior secondary streams: Science (PCM/PCB with AI, Biotech, CS, Applied Math), Commerce (Accounts, Business Studies, Economics, Math), and Humanities (Psychology, Legal Studies, Political Science, History, Economics)."
  },
  {
    topic: "CBSE Board Results & Toppers",
    keywords: ["result", "score", "topper", "rank", "cbse", "percent", "percentage", "academic", "siddhant", "ansh"],
    answer: "Benchmark Pass Record: DPS Indirapuram achieved a 100% pass result in CBSE X & XII exams. School toppers Siddhant Tiwari & Ansh Pathak scored 99.4%, with Commerce top score 98.2% and Humanities 97.6%."
  },
  {
    topic: "AI & Robotics Innovation Lab",
    keywords: ["ai", "robot", "robotics", "stem", "code", "coding", "lab", "3d printer", "humanoid"],
    answer: "Inaugurated in 2024, our futuristic 8K AI & Robotics Lab features humanoid robotic kits, 3D printing, IoT sensors, Python machine learning modules, and expert mentors preparing students for tech careers."
  },
  {
    topic: "Quantum Science Lab",
    keywords: ["quantum", "physics lab", "upcoming lab", "laser", "optics", "science lab"],
    answer: "Quantum Science Lab (Upcoming): An advanced research laboratory planned with laser optics, digital micro-analysis, and modern safety systems for advanced physics research."
  },
  {
    topic: "Facilities & Campus",
    keywords: ["facility", "campus", "smart classroom", "pool", "swimming", "library", "sport", "auditorium", "infrastructure"],
    answer: "Key Infrastructure: AR/VR Smart Classrooms, 50,000+ Book Digital Knowledge Library, Olympic-size Swimming Pool, 8K AI Robotics Lab, Multi-sports Complex, Professional Performing Arts Center, and AC Transport."
  },
  {
    topic: "Transport & Bus Service",
    keywords: ["bus", "transport", "route", "van", "pickup", "drop", "gps", "noida", "indirapuram", "vaishali", "vasundhara"],
    answer: "School Transport: Fleet of 50+ GPS-enabled AC buses with real-time app tracking, CCTV surveillance, and trained female attendants covering Indirapuram, Vaishali, Vasundhara, Noida, and Ghaziabad."
  },
  {
    topic: "School Timings & Office Hours",
    keywords: ["timing", "time", "hour", "open", "schedule", "working", "visiting"],
    answer: "School Hours: Mon-Sat 8:00 AM - 4:00 PM. Parent visiting hours: 9:00 AM - 11:30 AM (by prior appointment). Administrative office functions on all working days."
  },
  {
    topic: "Principal & Leadership",
    keywords: ["principal", "chairman", "management", "director", "priya", "shunglu", "dps society"],
    answer: "Leadership: Principal Ms. Priya Elizabeth John, Chairman Mr. V.K. Shunglu, Pro-Vice Chairperson Ms. Santosh Bansal. Established in 2003 under the aegis of The DPS Society, East of Kailash, New Delhi."
  },
  {
    topic: "Contact & Location",
    keywords: ["contact", "phone", "email", "address", "location", "map", "where", "reach", "number"],
    answer: "Address: 526/1, Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014 (Near CISF Camp). Phone: +91-0120-4660000 | Email: info@dpsindirapuram.com."
  },
  {
    topic: "Awards & Recognitions",
    keywords: ["award", "rank", "recognition", "british council", "times", "best school"],
    answer: "Prestigious Honors: Recipient of the British Council International Dimension Award (2020-23) and Times Education Icon Award. Consistently ranked among Top CBSE Schools in India."
  }
];

// Precision AI Response Engine
function getAIAnswer(query: string): string {
  const q = query.toLowerCase().trim();
  if (!q) return "How can I assist you with DPS Indirapuram today?";

  let bestMatch = KNOWLEDGE_BASE[0];
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        score += kw.length > 4 ? 3 : 1.5;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (maxScore > 0) {
    return bestMatch.answer;
  }

  return "DPS Indirapuram (Est. 2003) is a premier CBSE institution offering world-class academics, AI & Robotics Lab, 100% CBSE pass results (Top 99.4%), and 50+ AC GPS buses. For admissions or direct queries, please call +91-0120-4660000 or email info@dpsindirapuram.com.";
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! Welcome to DPS Indirapuram. I am DPSI AI, your 24/7 smart school guide. How can I assist you with Admissions, Facilities, or Academics today?",
      timestamp: "Just now"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleSend = (userQuery: string) => {
    if (!userQuery.trim() || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const textToSend = userQuery.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: textToSend, timestamp: timeStr }]);
    setIsTyping(true);

    setTimeout(() => {
      const fullAnswer = getAIAnswer(textToSend);
      const words = fullAnswer.split(" ");
      let currentWordIndex = 0;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "", timestamp: timeStr, isStreaming: true }
      ]);

      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      typingTimerRef.current = setInterval(() => {
        currentWordIndex++;
        const currentText = words.slice(0, currentWordIndex).join(" ");

        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
            updated[lastIdx] = {
              ...updated[lastIdx],
              text: currentText,
              isStreaming: currentWordIndex < words.length
            };
          }
          return updated;
        });

        if (currentWordIndex >= words.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, 25);
    }, 280);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] sm:w-[385px] h-[500px] max-h-[82vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-[28px] shadow-2xl shadow-slate-900/25 flex flex-col overflow-hidden mb-3 text-slate-900 dark:text-slate-100 relative max-w-[94vw]"
          >
            {/* Ethereal Smooth Ambient Aura Gradient Orbs */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/3 left-0 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />

            {/* STICKY TOP HEADER - Solid Dark Glass Header (Zero Bleed/Overlap) */}
            <div className="sticky top-0 z-40 shrink-0 p-3.5 bg-slate-900 text-white flex items-center justify-between shadow-sm border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0">
                  <Sparkles className="w-4.5 h-4.5 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight">DPSI AI</h3>
                  <p className="text-[11px] text-slate-300 font-normal leading-none mt-0.5">Official School Assistant</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer shrink-0"
                title="Close Chat Window"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MESSAGES BODY - Scrollable Area */}
            <div className="relative z-10 flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3.5 text-xs leading-relaxed">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-normal shadow-xs ${
                      m.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-xs shadow-md"
                        : "bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md"
                    }`}
                  >
                    {m.text}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-3 bg-[#0072ff] ml-1 animate-pulse" />
                    )}
                  </div>
                  {m.timestamp && !m.isStreaming && (
                    <span className="text-[9px] font-medium text-slate-400 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  )}
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex flex-col items-start text-slate-400">
                  <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* DOWNSIDE QUICK SUGGESTION CHIPS - Clean 2-Row Grid */}
            <div className="relative z-20 px-3 py-2 bg-slate-50/95 dark:bg-slate-950/95 border-t border-b border-slate-200/80 dark:border-slate-800 shrink-0">
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {[
                  { label: "Admissions 2026", icon: <GraduationCap className="w-3 h-3 text-sky-600 dark:text-sky-400" /> },
                  { label: "Class 11 Streams", icon: <MessageSquare className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> },
                  { label: "AI Robotics Lab", icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
                  { label: "CBSE Results", icon: <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleSend(chip.label)}
                    disabled={isTyping}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-[11px] truncate shrink-0 transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-sky-400 disabled:opacity-50"
                  >
                    {chip.icon}
                    <span className="truncate">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FORM - Sits perfectly flush at the bottom of the modal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative z-20 p-3 bg-[#18181b] text-white flex items-center gap-2 shrink-0 border-t border-slate-800"
            >
              <div className="flex-1 relative flex items-center min-w-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message DPSI AI..."
                  className="w-full px-4 py-2.5 rounded-full bg-[#27272a] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072ff]"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-[#0072ff] hover:bg-[#005bb5] text-white flex items-center justify-center transition-all shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button - Electric Blue Sparkle AI Badge */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl shadow-slate-950/50 border border-white/20 backdrop-blur-xl group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left pr-1">
            <p className="font-extrabold text-white text-xs leading-none">DPSI AI</p>
            <p className="text-[10px] text-slate-300 font-medium leading-none mt-1">Ask Anything</p>
          </div>
        </motion.button>
      )}
    </div>
  );
}
