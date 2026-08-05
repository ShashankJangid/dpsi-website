import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, MessageSquare, GraduationCap, Award, RotateCcw, ExternalLink, Phone, Mail, Mic } from "lucide-react";

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

// Dynamic Action Helper for Action Buttons
function getDynamicAction(query: string, text: string) {
  const combined = (query + " " + text).toLowerCase();
  if (combined.includes("admiss") || combined.includes("apply") || combined.includes("fee") || combined.includes("portal") || combined.includes("login") || combined.includes("register")) {
    return { actionUrl: "https://www.dpsindirapuram.com/page/admission-procedure", actionType: "link" as const };
  }
  if (combined.includes("contact") || combined.includes("phone") || combined.includes("call") || combined.includes("bus") || combined.includes("transport")) {
    return { actionUrl: "tel:+9101204660000", actionType: "call" as const };
  }
  if (combined.includes("email") || combined.includes("mail") || combined.includes("stream")) {
    return { actionUrl: "mailto:info@dpsindirapuram.com", actionType: "email" as const };
  }
  return { actionUrl: undefined, actionType: undefined };
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am DPSI AI, your smart school guide. Ask me about Admissions, Fees, Streams, AI Robotics Lab, Timings, or Facilities!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hold-to-Talk Voice Input State & Handlers
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  // Single-speak Voice Response Helper with Warm Indian / High-Quality Natural Voice Selection
  const spokenResponseRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speakAnswerOnce = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (spokenResponseRef.current === text) return;

    spokenResponseRef.current = text;
    window.speechSynthesis.cancel();

    // Clean markdown, URLs, and normalize acronyms for ultra-realistic human pronunciation
    const cleanText = text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`~[\]()|]/g, " ")
      .replace(/\bDPSI\b/gi, "D P S I")
      .replace(/\bCBSE\b/gi, "C B S E")
      .replace(/\bAI\b/gi, "A I")
      .replace(/\b3D\b/gi, "3 D")
      .replace(/\bIX & XI\b/gi, "9 and 11")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Prioritize ultra-realistic, natural, neural female voices across browsers and OS
      const realisticVoice =
        voices.find((v) => v.name.includes("Jenny") && (v.name.includes("Natural") || v.name.includes("Neural"))) ||
        voices.find((v) => v.name.includes("Aria") && (v.name.includes("Natural") || v.name.includes("Neural"))) ||
        voices.find((v) => v.name.includes("Neerja") && (v.name.includes("Natural") || v.name.includes("Neural"))) ||
        voices.find((v) => v.name.includes("Sonia") && (v.name.includes("Natural") || v.name.includes("Neural"))) ||
        voices.find((v) => v.name.includes("Serena") && v.name.includes("Premium")) ||
        voices.find((v) => v.name.includes("Samantha") && (v.name.includes("Premium") || v.name.includes("Enhanced"))) ||
        voices.find((v) => v.name.toLowerCase().includes("samantha")) ||
        voices.find((v) => v.name.toLowerCase().includes("google us english")) ||
        voices.find((v) => v.name.toLowerCase().includes("google uk english female")) ||
        voices.find((v) => v.name.toLowerCase().includes("serena") || v.name.toLowerCase().includes("tessa") || v.name.toLowerCase().includes("ava")) ||
        voices.find((v) => v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("karen") || v.name.toLowerCase().includes("zoe")) ||
        voices.find((v) => (v.lang.includes("en-IN") || v.lang.includes("en_IN")) && v.name.toLowerCase().includes("female")) ||
        voices.find((v) => v.lang.includes("en-IN") || v.lang.includes("en_IN")) ||
        voices.find((v) => v.lang.startsWith("en"));

      if (realisticVoice) {
        utterance.voice = realisticVoice;
        utterance.lang = realisticVoice.lang;
      }
    } else {
      utterance.lang = "en-IN";
    }

    // Ultra-realistic natural human speech prosody
    utterance.rate = 0.93; // Conversational, human cadence
    utterance.pitch = 1.05; // Warm, natural human pitch
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const isProcessingRef = useRef(false);

  const startListening = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening || recognitionRef.current) return;

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

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
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        const text = transcriptRef.current.trim();
        if (text) {
          transcriptRef.current = "";
          handleSend(text);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const stopListening = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const toggleMic = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening(e);
    } else {
      startListening(e);
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
    isProcessingRef.current = false;
    setMessages([
      {
        role: "assistant",
        text: "Chat reset! How can I help you with DPS Indirapuram today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const fetchGroqAIResponse = async (query: string, currentHistory: Message[]) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    try {
      const systemPrompt = `You are DPSI AI, the official conversational AI assistant for Delhi Public School Indirapuram (DPS Indirapuram), Ghaziabad.
Your job is to provide accurate, warm, concise, and helpful answers to students, parents, and visitors about DPS Indirapuram.
Keep your responses friendly, professional, and under 3-4 sentences max.

Detailed Knowledge Base & School Info:
- AI & Robotics Innovation Lab: Located on the 3rd Floor of C-Block. Equipped with Humanoid Robots, Robotic Quadruped Dogs, Multi-axis Robotic Arms, Raspberry Pi kits, 3D printers, Python Machine Learning & AI workstations, IoT sensor modules, drone programming setups, and expert mentors for Class VI to XII (Class 6-12).
- MakerSpace Lab: Located on the 2nd Floor of A-Block. A creative engineering space where students turn imagination into reality, building real-world projects such as Hydroponic Smart Farming Systems, Cockpit Flight Simulators, Robotic Arms, Autonomous Line Following Cars, IoT automation, and innovative robotics.
- Design & Technology (D&T) Lab: Located on the 2nd Floor of A-Block.
- School Canteen: Located on the Ground Floor of B-Block.
- Main Reception: Located on the Ground Floor of B-Block.
- Admissions 2026-27: OPEN for Pre-Nursery to Class IX & XI. Fill out the online registration form on our official portal: https://www.dpsindirapuram.com/page/admission-procedure
- Fee Structure & Payment: Quarterly school fees payable online via the SchoolsOS portal. Fee desk email: info@dpsindirapuram.com
- Class XI Streams: 3 Streams Offered: Science (PCM/PCB + AI/Biotech), Commerce (Accounts, Economics, Math), & Humanities (Psychology, Legal Studies).
- CBSE Board Results: 100% Pass Record in CBSE. School Toppers Siddhant Tiwari & Ansh Pathak scored 99.4%. Commerce topper 98.2%, Humanities topper 97.6%.
- Facilities & Infrastructure: AI & Robotics Innovation Lab (C-Block 3rd Floor), MakerSpace & D&T Labs (A-Block 2nd Floor), Main Reception & Canteen (B-Block Ground Floor), Olympic-size swimming pool, 50+ GPS AC buses, 24/7 CCTV & resident medical infirmary.
- Leadership: Principal Ms. Priya Elizabeth John, Pro-Vice Chairperson Ms. Santosh Bansal, Chairman Mr. V.K. Shunglu.
- Location & Contact: Address: 526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad UP 201014. Call +91-0120-4660000 | Email info@dpsindirapuram.com.`;

      const formattedHistory = currentHistory
        .filter((m) => m.text)
        .slice(-6)
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        }));

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            { role: "user", content: query },
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text && text.trim()) {
          const action = getDynamicAction(query, text.trim());
          return { answer: text.trim(), actionUrl: action.actionUrl, actionType: action.actionType };
        }
      }
    } catch (err) {
      console.warn("Groq API call error:", err);
    }

    const fallbackAction = getDynamicAction(query, "");
    return {
      answer: "I am DPSI AI. Please ensure VITE_GROQ_API_KEY is configured in Vercel settings for real-time AI answers! For inquiries, call +91-0120-4660000.",
      actionUrl: fallbackAction.actionUrl || "tel:+9101204660000",
      actionType: fallbackAction.actionType || ("call" as const)
    };
  };

  const handleSend = async (userQuery: string) => {
    const textToSend = userQuery.trim();
    if (!textToSend || isTyping || isProcessingRef.current) return;
    isProcessingRef.current = true;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setInput("");
    transcriptRef.current = "";

    setMessages((prev) => [...prev, { role: "user", text: textToSend, timestamp: timeStr }]);
    setIsTyping(true);

    try {
      const response = await fetchGroqAIResponse(textToSend, messages);
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
          isProcessingRef.current = false;
          speakAnswerOnce(response.answer);
        }
      }, 8);
    } catch {
        setIsTyping(false);
        isProcessingRef.current = false;
      }
    };

    const [isDragging, setIsDragging] = useState(false);

    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] pointer-events-auto font-sans">
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
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  x: [0, 20, 0],
                  y: [0, -15, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-[#fed7aa]/50 via-[#fbcfe8]/40 to-[#bae6fd]/30 blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, -15, 0],
                  y: [0, 20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-to-tr from-[#a7f3d0]/50 via-[#cbd5e1]/40 to-[#fed7aa]/30 blur-3xl pointer-events-none"
              />

              {/* STICKY TOP HEADER WITH ANIMATED MOVING GRADIENT */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="sticky top-0 z-40 shrink-0 p-3.5 bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_25%,#1e3a8a_50%,#047857_75%,#0f172a_100%)] bg-[size:300%_300%] text-white flex items-center justify-between shadow-md border-b border-emerald-400/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white leading-tight">
                      DPSI AI
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleResetChat}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Reset Conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Close Assistant"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* MESSAGES SCROLL AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 relative z-10 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm relative ${
                        msg.role === "user"
                          ? "bg-slate-900 text-white rounded-br-xs font-medium"
                          : "bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-white/80 dark:border-slate-700/80 shadow-md backdrop-blur-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-1 animate-pulse" />
                      )}

                      {/* ACTION BUTTON ENHANCEMENT */}
                      {msg.actionUrl && msg.role === "assistant" && !msg.isStreaming && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          {msg.actionType === "call" ? (
                            <a
                              href={msg.actionUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call School Office
                            </a>
                          ) : msg.actionType === "email" ? (
                            <a
                              href={msg.actionUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" /> Email Admissions Desk
                            </a>
                          ) : (
                            <a
                              href={msg.actionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Open Link
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {msg.timestamp && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    )}
                  </motion.div>
                ))}

                {/* Instant Audio Wave / Glowing Orb Loading Animation */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl rounded-bl-xs border border-white/80 dark:border-slate-700/80 shadow-md w-max"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-sm animate-spin-slow">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-4 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-4 bg-blue-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-1">
                      DPSI AI is thinking...
                    </span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTION CHIPS - 2x2 GRID WITHOUT SIDE SCROLL */}
              <div className="px-3 pt-2 pb-1.5 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shrink-0">
                <div className="grid grid-cols-2 gap-1.5 py-0.5">
                  {[
                    { label: "Admissions 2026", icon: <GraduationCap className="w-3 h-3 text-sky-600" />, query: "Tell me about admissions 2026" },
                    { label: "Class 11 Streams", icon: <MessageSquare className="w-3 h-3 text-indigo-600" />, query: "What streams are offered in Class 11?" },
                    { label: "AI Robotics Lab", icon: <Bot className="w-3 h-3 text-amber-500" />, query: "Tell me about your AI Robotics Lab" },
                    { label: "CBSE Results", icon: <Award className="w-3 h-3 text-emerald-600" />, query: "What are your recent CBSE results?" },
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip.query)}
                      disabled={isTyping}
                      className="w-full px-2 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-white/80 text-slate-800 font-bold text-[11px] truncate transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:border-sky-400 disabled:opacity-50"
                    >
                      {chip.icon}
                      <span className="truncate">{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT FORM WITH ANIMATED MOVING GRADIENT */}
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative z-20 p-3 bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_25%,#1e3a8a_50%,#047857_75%,#0f172a_100%)] bg-[size:300%_300%] text-white shrink-0 border-t border-emerald-400/30"
              >
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-full shadow-lg border border-rose-400/40 flex items-center gap-1.5 whitespace-nowrap z-30 pointer-events-none"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>Listening...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Unified Input Box Pill Container */}
                <div className="w-full flex items-center gap-1.5 p-1 rounded-full bg-white/10 border border-white/20 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  {/* Extreme Left Mic Button */}
                  <button
                    type="button"
                    onClick={toggleMic}
                    title={isListening ? "Stop listening and send" : "Speak to DPSI AI"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0 ${
                      isListening
                        ? "bg-rose-600 text-white scale-105 shadow-rose-500/50"
                        : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
                    }`}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                  </button>

                  {/* Input Text Field */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-[16px] sm:text-xs text-white placeholder-white/50 focus:outline-none px-2.5 py-1"
                  />

                  {/* Extreme Right Send Button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#10b981] to-[#00c6ff] text-white flex items-center justify-center transition-all disabled:opacity-40 shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Draggable Trigger Button with Smooth Moving Gradient */}
        {!isOpen && (
          <motion.button
            drag
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              setTimeout(() => setIsDragging(false), 50);
            }}
            onClick={() => {
              if (!isDragging) setIsOpen(true);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.2 }
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#fce7f3_30%,#e2e8f0_60%,#ffedd5_90%,#ffffff_100%)] bg-[size:300%_300%] text-slate-900 font-bold text-xs shadow-2xl shadow-slate-900/30 border border-white/90 backdrop-blur-2xl cursor-grab active:cursor-grabbing relative select-none touch-none"
            title="Drag to move, click to open DPSI AI Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0072ff] to-[#00c6ff] flex items-center justify-center text-white shadow-md shrink-0 pointer-events-none">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="text-left pr-1 pointer-events-none">
              <p className="font-extrabold text-slate-900 text-xs leading-none">DPSI AI</p>
              <p className="text-[10px] text-slate-600 font-medium leading-none mt-1">Ask Anything</p>
            </div>
          </motion.button>
        )}
      </div>
    );
  }
