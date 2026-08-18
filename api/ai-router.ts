import { createRouter, publicQuery } from "./middleware";
import { z } from "zod";

interface GroqApiResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

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

      const systemPrompt = `You are DPSI AI, the official conversational AI assistant for Delhi Public School Indirapuram (DPS Indirapuram), Ghaziabad.
Your role is to help parents, students, and visitors with accurate, warm, and concise information about DPS Indirapuram.
Key Details:
- Admissions 2026-27: Open for Pre-Nursery to Class IX & XI. Online registration portal: https://dpsindp.schoolforschools.ai/login
- Fee Structure: Quarterly fees payable online via SchoolsOS. Desk email: info@dpsindirapuram.com
- Class XI Streams: Science (PCM/PCB + AI/Biotech), Commerce (Accounts, Economics, Math), & Humanities (Psychology, Legal Studies).
- CBSE Results: 100% Pass Record. School toppers Siddhant Tiwari & Ansh Pathak scored 99.4%.
- Facilities: AI & Robotics Innovation Lab (3D printers, humanoid kits), Olympic-size swimming pool, 50+ GPS AC buses, 24/7 CCTV & infirmary.
- Leadership: Principal Ms. Priya Elizabeth John, Pro-Vice Chairperson Ms. Santosh Bansal, Chairman Mr. V.K. Shunglu.
- Contact: Phone +91-0120-4660000 | Email info@dpsindirapuram.com | Address: 526/1 Ahinsa Khand-II, Indirapuram, Ghaziabad UP 201014.

Keep your answers friendly, concise (2-4 sentences max), and directly address the user's question.`;

      try {
        const messagesPayload = [
          { role: "system", content: systemPrompt },
          ...(input.history || []).map((h) => ({ role: h.role, content: h.text })),
          { role: "user", content: input.message },
        ];

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: messagesPayload,
            temperature: 0.5,
            max_tokens: 350,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("Groq API error response:", errText);
          throw new Error(`Groq API error: ${response.status}`);
        }

        const data = (await response.json()) as GroqApiResponse;
        const replyText = data?.choices?.[0]?.message?.content || "I am here to help you with DPS Indirapuram. How can I assist you?";
        return { answer: replyText };
      } catch (error) {
        console.error("Error calling Groq API:", error);
        return { answer: null };
      }
    }),
});
