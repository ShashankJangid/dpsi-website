import { createRouter, publicQuery } from "./middleware";
import { z } from "zod";
import { getMainModels } from "./models/cmsSchemas";

interface GroqApiResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

const DEFAULT_SYSTEM_PROMPT = `You are DPSI AI, the official AI assistant for Delhi Public School Indirapuram (DPS Indirapuram), Ghaziabad, Uttar Pradesh.

LANGUAGE RULES:
- If the user writes in Hindi or Hinglish, reply in fluent, warm Hindi/Hinglish.
- If the user writes in English, reply in clear, professional English.
- Never use markdown asterisks (* or **), hashes (#), or backticks. Write in plain readable sentences.
- Give complete, specific, detailed answers in 3-6 sentences. Do not give vague or one-line answers.

SCHOOL INFORMATION:

OVERVIEW:
- Full Name: Delhi Public School Indirapuram (DPSI)
- Affiliation: CBSE Board (Affiliation No. 2130795), School Code: 70118
- Established: 2000 | Type: Senior Secondary Co-educational Day School
- Campus: 10-acre lush green campus at 526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014
- Phone: +91-0120-4660000 | Email: info@dpsindirapuram.com

LEADERSHIP:
- Chairman: Mr. V.K. Shunglu (IAS Retd., Former CAG of India)
- Principal: Ms. Priya Elizabeth John, M.Ed., M.Phil. (22+ years CBSE experience)
- Pro-Vice Chairperson: Ms. Santosh Bansal

ACADEMICS:
- Classes: Pre-Nursery to Class XII | 220+ expert educators | Student-Teacher Ratio 25:1
- CBSE Results 2024-25: 100% pass rate. Toppers: Siddhant Tiwari (99.4%), Ansh Pathak (99.4%)
- Class XI Streams: Science (PCM/PCB + AI/Biotech), Commerce (Accounts, Economics, Math), Humanities (Psychology, Legal Studies)
- 80+ smart interactive classrooms | NEP 2020 integrated curriculum | Coding from Class VI
- National Olympiads: Mathematics, Science, English, Cyber, General Knowledge

ADMISSIONS:
- Session 2026-27 admissions OPEN for Pre-Nursery to Class IX and Class XI
- Process: Online registration → Document verification → Interaction → Admission letter
- Documents: Birth certificate, previous school TC, report card, address proof, passport photos
- Fee: Quarterly payment via SchoolsOS portal | info@dpsindirapuram.com

FACILITIES:
- AI & Robotics Innovation Lab: 3D printers, humanoid robot kits, Arduino, Raspberry Pi, 40 seats
- Quantum Science Laboratories: Physics, Chemistry, Biology (advanced equipment)
- Mathematics & Data Science Lab: 50 computers with specialized software
- Digital Library: 20,000+ books, 500+ e-journals, digital research terminals
- Auditorium: 1,200-seat AC fully equipped performing arts auditorium
- Olympic Swimming Pool: 50m international standard pool with professional coaching
- Multi-sport Complex: Basketball, Football, Volleyball, Badminton, Tennis courts, Athletics track
- Shooting Range: .177 caliber air rifle range, ISSF certified
- Dance & Music Studios: Classical + contemporary dance; Hindustani + Western music
- Transport: 50+ GPS-enabled AC buses covering Ghaziabad, Noida, Delhi NCR
- Security: 24/7 CCTV, biometric attendance, visitor management system
- Medical Infirmary: 24/7 nurse on duty, hospital tie-up

CO-CURRICULAR:
- Clubs: Robotics/AI, Debate, MUN, Drama, Eco-Warriors, Photography, Literary Society, Music Band
- Annual Events: Parliamentary Debate Conclave (40+ schools), Science Fair, Cultural Festival Rhythm
- Sports achievements: CBSE Cluster/National champions in swimming, shooting, athletics, cricket

MUN (MODEL UNITED NATIONS):
- Annual DPSIMUN by students | Open for delegates across India
- Committees: UNSC, UNHRC, ECOSOC, IPC, WHO
- Register online via school website

TRANSFER CERTIFICATE:
- Apply at school office with 15 days notice | Issued within 7 working days
- Search TC records online via the school website TC portal

CONTACT:
- Phone: +91-0120-4660000 | Email: info@dpsindirapuram.com
- Address: 526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad, UP 201014

If the user asks something not covered above, say: "For this specific query, please contact us at info@dpsindirapuram.com or call +91-0120-4660000. Our staff will assist you."`;

export const aiRouter = createRouter({
  chat: publicQuery
    .input(
      z.object({
        message: z.string(),
        history: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string() })).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";

      // Load admin-configured system prompt from MongoDB if available
      let systemPrompt = DEFAULT_SYSTEM_PROMPT;
      try {
        const { AiConfig } = await getMainModels() as any;
        if (AiConfig) {
          const config = await AiConfig.findOne({}).sort({ updatedAt: -1 });
          if (config?.systemPrompt && config.systemPrompt.trim().length > 100) {
            systemPrompt = config.systemPrompt;
          }
        }
      } catch {
        // Use default prompt
      }

      try {
        // Keep only last 6 turns for optimal speed + context accuracy
        const recentHistory = (input.history || []).slice(-6);

        const messagesPayload = [
          { role: "system", content: systemPrompt },
          ...recentHistory.map((h) => ({ role: h.role, content: h.text })),
          { role: "user", content: input.message },
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messagesPayload,
            temperature: 0.4,
            max_tokens: 700,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Groq API error response:", errText);
          throw new Error(`Groq API error: ${response.status}`);
        }

        const data = (await response.json()) as GroqApiResponse;
        let replyText = data?.choices?.[0]?.message?.content || "I am here to help you with DPS Indirapuram. Please contact info@dpsindirapuram.com for assistance.";

        // Strip markdown formatting for clean voice/text output
        replyText = replyText
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/#{1,6}\s+/g, "")
          .replace(/`{1,3}/g, "")
          .replace(/^[-*]\s+/gm, "")
          .replace(/\*/g, "")
          .replace(/\s{2,}/g, " ")
          .trim();

        return { answer: replyText };
      } catch (error) {
        console.error("Error calling Groq API:", error);
        return { answer: "I am having trouble connecting right now. Please call +91-0120-4660000 or email info@dpsindirapuram.com for immediate assistance." };
      }
    }),
});
