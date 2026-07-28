import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, User } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const DPSI_KNOWLEDGE: Record<string, string> = {
  admission: "Admissions 2026-27 are open for Pre-Nursery to Class IX & XI. Apply online via SchoolsOS portal at https://dpsindp.schoolforschools.ai/login or call +91-0120-4660000.",
  fee: "For fee structure details, please visit the official SchoolsOS portal or contact our accounts desk at info@dpsindirapuram.com / +91-0120-4660000.",
  benefit: "Key Benefits: CBSE top score 99.4%, Times Education Icon winner, AI & Robotics Lab, Quantum Science Lab, Olympic Pool, 50+ AC GPS buses, 24/7 security.",
  facility: "Facilities: Futuristic AI & Robotics Lab, Quantum Physics Lab, Smart AR/VR Classrooms, Digital Library (50k+ books), Sports Complex, and AC Transport.",
  location: "DPS Indirapuram is located at 526/1, Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014. Phone: +91-0120-4660000.",
  contact: "Phone: +91-0120-4660000 / 4670000 | Email: info@dpsindirapuram.com | Hours: Mon-Sat 8:00 AM - 4:00 PM.",
  result: "CBSE XII & X Board Results: Top score 99.4% with 100% pass record in Class X & XII exams.",
  leadership: "Chairman: Mr. V.K. Shunglu | Pro-Vice Chairperson: Ms. Santosh Bansal | Principal: Ms. Priya Elizabeth John.",
  default: "DPS Indirapuram is a premier CBSE school (Est. 2003). For admissions, facilities, or queries, call +91-0120-4660000 or visit dpsindp.schoolforschools.ai/login."
};

function getAIAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("admiss") || q.includes("apply") || q.includes("join") || q.includes("register")) {
    return DPSI_KNOWLEDGE.admission;
  }
  if (q.includes("fee") || q.includes("cost") || q.includes("pay")) {
    return DPSI_KNOWLEDGE.fee;
  }
  if (q.includes("benefit") || q.includes("why") || q.includes("best") || q.includes("good")) {
    return DPSI_KNOWLEDGE.benefit;
  }
  if (q.includes("facil") || q.includes("lab") || q.includes("sport") || q.includes("pool") || q.includes("bus")) {
    return DPSI_KNOWLEDGE.facility;
  }
  if (q.includes("locat") || q.includes("where") || q.includes("address")) {
    return DPSI_KNOWLEDGE.location;
  }
  if (q.includes("contact") || q.includes("phone") || q.includes("email") || q.includes("call")) {
    return DPSI_KNOWLEDGE.contact;
  }
  if (q.includes("result") || q.includes("score") || q.includes("topper") || q.includes("board")) {
    return DPSI_KNOWLEDGE.result;
  }
  if (q.includes("leader") || q.includes("principal") || q.includes("chairman")) {
    return DPSI_KNOWLEDGE.leadership;
  }
  return DPSI_KNOWLEDGE.default;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am DPSI AI. Ask me about admissions, fees, facilities, or school benefits!"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    setTimeout(() => {
      const reply = getAIAnswer(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 300);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-[320px] sm:w-[360px] h-[450px] bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 text-white"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    DPSI AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[10px] text-emerald-300 font-medium">Instant School Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-slate-950/60 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              {["Admissions 2026", "School Benefits", "Facilities", "Contact Info"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setMessages((prev) => [...prev, { role: "user", text: chip }]);
                    setTimeout(() => {
                      setMessages((prev) => [...prev, { role: "assistant", text: getAIAnswer(chip) }]);
                    }, 250);
                  }}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 whitespace-nowrap shrink-0 transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      m.role === "user" ? "bg-amber-500 text-slate-950" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {m.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[82%] shadow-sm ${
                      m.role === "user"
                        ? "bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-none"
                        : "bg-slate-800/90 border border-emerald-500/20 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI anything about DPSI..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-lg shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-2xl shadow-emerald-600/40 border border-emerald-400/40"
        >
          <div className="relative">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span>DPSI AI</span>
        </motion.button>
      )}
    </div>
  );
}
