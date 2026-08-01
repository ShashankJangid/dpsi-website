import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageSquare, GraduationCap, Award, RotateCcw, ExternalLink, Phone, Mail, Mic } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: "assistant" | "user";
  text: string;
  timestamp?: string;
  isStreaming?: boolean;
  actionUrl?: string;
  actionType?: "call" | "email" | "link";
}

// Expanded Ultra-Precise Knowledge Base for DPS Indirapuram (Short & Concise Responses)
const KNOWLEDGE_BASE: { keywords: string[]; topic: string; answer: string; actionUrl?: string; actionType?: "call" | "email" | "link" }[] = [
  {
    topic: "Admissions 2026-27",
    keywords: ["admiss", "apply", "join", "register", "nursery", "prep", "class 1", "admission date", "form", "entry", "eligibility"],
    answer: "Admissions 2026-27 are OPEN for Pre-Nursery to IX & XI. Fill the online registration form on our official portal.",
    actionUrl: "https://dpsindp.schoolforschools.ai/login",
    actionType: "link"
  },
  {
    topic: "Fee Structure & Payment",
    keywords: ["fee", "cost", "charge", "payment", "installment", "structure", "dues", "tuition", "pay"],
    answer: "Quarterly school fees can be paid online via the SchoolsOS portal. For detailed fee desk queries, contact info@dpsindirapuram.com.",
    actionUrl: "https://dpsindp.schoolforschools.ai/login",
    actionType: "link"
  },
  {
    topic: "Class XI Streams",
    keywords: ["stream", "class 11", "class 10", "class 12", "subject", "science", "commerce", "humanities", "arts", "pcm", "pcb", "biotech"],
    answer: "3 Streams Offered: Science (PCM/PCB + AI/Biotech), Commerce (Accounts, Economics, Math), & Humanities (Psychology, Legal Studies).",
    actionUrl: "mailto:info@dpsindirapuram.com",
    actionType: "email"
  },
  {
    topic: "CBSE Board Results & Toppers",
    keywords: ["result", "score", "topper", "rank", "cbse", "percent", "percentage", "academic", "siddhant", "ansh"],
    answer: "100% Pass Record in CBSE. School Toppers Siddhant Tiwari & Ansh Pathak scored 99.4%, with Commerce 98.2% and Humanities 97.6%.",
    actionUrl: "https://dpsindp.schoolforschools.ai/login",
    actionType: "link"
  },
  {
    topic: "AI & Robotics Innovation Lab",
    keywords: ["ai", "robot", "robotics", "stem", "code", "coding", "lab", "3d printer", "humanoid"],
    answer: "Inaugurated 2024: Features humanoid robotic kits, 3D printers, Python Machine Learning, IoT sensors, and expert mentors.",
  },

  {
    topic: "Transport & Bus Fleet",
    keywords: ["bus", "transport", "route", "van", "pickup", "drop", "gps", "noida", "indirapuram", "vaishali", "vasundhara", "ghaziabad"],
    answer: "50+ GPS-enabled AC buses with live app tracking, CCTV surveillance, and trained female attendants covering Noida, Ghaziabad & NCR.",
    actionUrl: "tel:+9101204660000",
    actionType: "call"
  },
  {
    topic: "School Timings",
    keywords: ["timing", "time", "hour", "open", "schedule", "working", "visiting"],
    answer: "Junior Wing: 8:00 AM - 1:30 PM. Senior Wing: 8:00 AM - 2:10 PM (Mon-Sat). Parent visiting hours: 9:00 AM - 11:30 AM by appointment.",
  },
  {
    topic: "Sports & Swimming Pool",
    keywords: ["sport", "swimming", "pool", "cricket", "football", "basketball", "tennis", "skating", "taekwondo"],
    answer: "Facilities include an Olympic-size swimming pool, cricket academy, basketball courts, lawn tennis, and indoor sports hall.",
  },
  {
    topic: "Leadership & Principal",
    keywords: ["principal", "chairman", "management", "director", "priya", "shunglu", "bansal", "dps society"],
    answer: "Principal: Ms. Priya Elizabeth John | Pro-Vice Chairperson: Ms. Santosh Bansal | Chairman: Mr. V.K. Shunglu.",
  },
  {
    topic: "Location & Contact",
    keywords: ["contact", "phone", "email", "address", "location", "map", "where", "reach", "number"],
    answer: "Address: 526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad UP 201014. Call +91-0120-4660000 | Email info@dpsindirapuram.com.",
    actionUrl: "tel:+9101204660000",
    actionType: "call"
  },
  {
    topic: "School Uniform",
    keywords: ["uniform", "dress", "code", "blazer", "tie", "shirt", "winter uniform", "summer uniform"],
    answer: "Summer: White shirt with green collar & trousers/skirt. Winter: Green blazer with school crest, grey trousers, and school tie.",
  },
  {
    topic: "Houses & Clubs",
    keywords: ["house", "club", "ganga", "yamuna", "jhelum", "chenab", "ravi", "beas", "mun", "astronomy", "music"],
    answer: "6 Houses: Ganga, Yamuna, Jhelum, Chenab, Ravi, Beas. Active Clubs: Astronomy, Robotics, MUN, Eco Club, Coding, & Dramatics.",
  },
  {
    topic: "Safety & Medical",
    keywords: ["safety", "security", "cctv", "nurse", "medical", "infirmary", "doctor", "guard"],
    answer: "24/7 CCTV surveillance, biometric security, trained guards, and full-time infirmary with resident medical nurse.",
  }
];

// Precision AI Response Engine
function getAIResponse(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { answer: "How can I assist you with DPS Indirapuram today?" };

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
    return { answer: bestMatch.answer, actionUrl: bestMatch.actionUrl, actionType: bestMatch.actionType };
  }

  return {
    answer: "DPS Indirapuram (Est. 2003) offers top CBSE academics, AI & Robotics Lab, 100% CBSE results, and 50+ AC GPS buses. Call +91-0120-4660000.",
    actionUrl: "tel:+9101204660000",
    actionType: "call" as const
  };
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am DPSI AI, your smart school guide. Ask me about Admissions, Fees, Streams, Timings, or Facilities!",
      timestamp: "Just now"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hold-to-Talk Voice Input State & Handlers
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  // Single-speak Voice Response Helper (speaks answer only ONE time)
  const spokenResponseRef = useRef<string | null>(null);

  const speakAnswerOnce = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (spokenResponseRef.current === text) return;

    spokenResponseRef.current = text;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startListening = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) return;

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      transcriptRef.current = "";

      recognition.onresult = (event: any) => {
        let current = "";
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        transcriptRef.current = current;
        setInput(current);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error("Speech recognition error:", err);
    }
  };

  const stopListening = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);

    const finalText = transcriptRef.current.trim();
    if (finalText) {
      handleSend(finalText);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleResetChat = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    spokenResponseRef.current = null;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setIsTyping(false);
    setMessages([
      {
        role: "assistant",
        text: "Chat reset! How can I help you with DPS Indirapuram today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const handleSend = (userQuery: string) => {
    if (!userQuery.trim() || isTyping) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const textToSend = userQuery.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: textToSend, timestamp: timeStr }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(textToSend);
      const words = response.answer.split(" ");
      let currentWordIndex = 0;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "",
          timestamp: timeStr,
          isStreaming: true,
          actionUrl: response.actionUrl,
          actionType: response.actionType
        }
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
          speakAnswerOnce(response.answer);
        }
      }, 8);
    }, 50);
  };

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-50 pointer-events-auto font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] sm:w-[385px] h-[500px] max-h-[82vh] bg-gradient-to-br from-[#fce7f3] via-[#e2e8f0] to-[#ffedd5] backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-2xl shadow-slate-900/25 flex flex-col overflow-hidden mb-3 text-slate-900 relative max-w-[94vw]"
          >
            {/* Peach Ash Grey Silk Ambient Wavy Mesh Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#fed7aa]/35 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-[#cbd5e1]/50 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#fecdd3]/35 blur-3xl pointer-events-none" />

            {/* STICKY TOP HEADER - Cosmic Indigo to Neon Mint Teal Gradient */}
            <div className="sticky top-0 z-40 shrink-0 p-3.5 bg-gradient-to-r from-[#1e1b4b] via-[#1e3a8a] to-[#047857] text-white flex items-center justify-between shadow-sm border-b border-emerald-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0">
                  <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-tight">DPSI AI</h3>
                </div>
              </div>

              {/* Action Buttons: Reset Chat & Close */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Clear Chat History"
                  aria-label="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Close Chat Window"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MESSAGES BODY - Scrollable Area */}
            <div className="relative z-10 flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-xs ${
                      m.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-xs shadow-md font-medium"
                        : "bg-white/95 text-slate-900 rounded-tl-xs border border-white/80 shadow-xs backdrop-blur-md font-semibold"
                    }`}
                  >
                    {m.text}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-3 bg-[#0072ff] ml-1 animate-pulse" />
                    )}

                    {/* Quick Action Button Attachment for AI responses */}
                    {m.role === "assistant" && !m.isStreaming && m.actionUrl && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80">
                        <a
                          href={m.actionUrl}
                          target={m.actionType === "link" ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0072ff] font-bold text-[11px] border border-sky-200 transition-all shadow-2xs"
                        >
                          {m.actionType === "link" && <ExternalLink className="w-3 h-3" />}
                          {m.actionType === "call" && <Phone className="w-3 h-3" />}
                          {m.actionType === "email" && <Mail className="w-3 h-3" />}
                          <span>
                            {m.actionType === "link" && "Open Admission Portal"}
                            {m.actionType === "call" && "Call +91-0120-4660000"}
                            {m.actionType === "email" && "Email Info Desk"}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                  {m.timestamp && !m.isStreaming && (
                    <span className="text-[9px] font-medium text-slate-500 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  )}
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex flex-col items-start text-slate-400">
                  <div className="p-3 rounded-2xl bg-white/95 border border-white/80 rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0072ff] animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* DOWNSIDE QUICK SUGGESTION CHIPS - Clean 2-Row Grid */}
            <div className="relative z-20 px-3 py-2 bg-white/60 backdrop-blur-md border-t border-b border-white/80 shrink-0">
              <div className="grid grid-cols-2 gap-1.5 w-full">
                {[
                  { label: "Admissions 2026", icon: <GraduationCap className="w-3 h-3 text-sky-600" /> },
                  { label: "Class 11 Streams", icon: <MessageSquare className="w-3 h-3 text-indigo-600" /> },
                  { label: "AI Robotics Lab", icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
                  { label: "CBSE Results", icon: <Award className="w-3 h-3 text-emerald-600" /> },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleSend(chip.label)}
                    disabled={isTyping}
                    className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-white/80 text-slate-800 font-bold text-[11px] truncate shrink-0 transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-sky-400 disabled:opacity-50"
                  >
                    {chip.icon}
                    <span className="truncate">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FORM - Cosmic Indigo to Neon Mint Teal Gradient */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="relative z-20 p-3 bg-gradient-to-r from-[#1e1b4b] via-[#1e3a8a] to-[#047857] text-white flex items-center gap-2 shrink-0 border-t border-emerald-500/30"
            >
              {/* LISTENING FLOATING BANNER */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-full shadow-lg border border-rose-400/40 flex items-center gap-1.5 whitespace-nowrap z-30 pointer-events-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Listening... Hold button to speak</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 relative flex items-center min-w-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening... release to send" : "Message DPSI AI..."}
                  className={`w-full px-4 py-2.5 rounded-full bg-white/15 border text-xs text-white placeholder-slate-300 focus:outline-none transition-all ${
                    isListening
                      ? "border-rose-400 ring-2 ring-rose-400/50 bg-rose-950/40 placeholder-rose-200"
                      : "border-white/20 focus:ring-2 focus:ring-emerald-400"
                  }`}
                />
              </div>

              {/* HOLD-TO-TALK VOICE BUTTON */}
              <div className="relative shrink-0">
                {isListening && (
                  <span className="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-75" />
                )}
                <button
                  type="button"
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onMouseLeave={stopListening}
                  onTouchStart={startListening}
                  onTouchEnd={stopListening}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer select-none ${
                    isListening
                      ? "bg-rose-600 text-white scale-110 shadow-rose-500/50 shadow-lg ring-2 ring-rose-300"
                      : "bg-white/15 hover:bg-white/25 text-white border border-white/20 active:scale-95"
                  }`}
                  title="Hold to speak to DPSI AI"
                >
                  <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                </button>
              </div>

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#10b981] to-[#00c6ff] hover:brightness-110 text-white flex items-center justify-center transition-all shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button - Left Side & Smooth Draggable Across Entire Screen */}
      {!isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.05 }}
          className="inline-block cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-[#fce7f3] via-[#e2e8f0] to-[#ffedd5] text-slate-900 font-bold text-xs shadow-2xl shadow-slate-900/25 border border-white/90 backdrop-blur-2xl group transform-gpu will-change-transform hover:-translate-y-0.5 hover:shadow-slate-900/40 transition-all duration-300 cursor-grab active:cursor-grabbing"
            title="Drag to move • Click to open DPSI AI"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div className="text-left pr-1">
              <p className="font-extrabold text-slate-900 text-xs leading-none">DPSI AI</p>
              <p className="text-[10px] text-slate-600 font-medium leading-none mt-1">Ask Anything</p>
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
