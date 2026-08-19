import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

const fallbackEvents = [
  {
    id: 1,
    title: "18th Annual DPS Indirapuram Parliamentary Debate Conclave",
    description: "Over 40 top NCR schools participating in 3 days of debate, critical thinking, and diplomacy.",
    image: "/images/facilities/auditorium.webp",
    eventDate: new Date("2026-09-15"),
    location: "Main School Auditorium",
    category: "Events",
  },
  {
    id: 2,
    title: "All-India Inter-DPS Robotics & AI Symposium 2026",
    description: "Futuristic innovation showcase featuring humanoid bots, automated drones, and AI vision projects.",
    image: "/images/facilities/ai_robotics_lab.webp",
    eventDate: new Date("2026-10-05"),
    location: "AI Innovation Lab",
    category: "Academics",
  },
  {
    id: 3,
    title: "Annual Sports & Aquatic Meet 2026",
    description: "Inter-house swimming, track & field events, basketball and soccer tournaments.",
    image: "/images/facilities/swimming_pool.webp",
    eventDate: new Date("2026-11-12"),
    location: "Sports Complex",
    category: "Sports",
  },
];

export const eventsRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true, category: { $in: ["Events", "Sports", "Academics"] } }).sort({ eventDate: -1 });
      if (acts && acts.length > 0) {
        return acts.map((a: any, idx: number) => ({
          id: idx + 1,
          title: a.title,
          description: a.description,
          image: a.imageUrl || "/images/facilities/auditorium.webp",
          eventDate: a.eventDate || new Date(),
          location: "DPSI Campus",
          category: a.category || "Events",
        }));
      }
      return fallbackEvents;
    } catch {
      return fallbackEvents;
    }
  }),

  all: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
      if (acts && acts.length > 0) {
        return acts.map((a: any, idx: number) => ({
          id: idx + 1,
          title: a.title,
          description: a.description,
          image: a.imageUrl || "/images/facilities/auditorium.webp",
          eventDate: a.eventDate || new Date(),
          location: "DPSI Campus",
          category: a.category || "Events",
        }));
      }
      return fallbackEvents;
    } catch {
      return fallbackEvents;
    }
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        description: z.string().optional(),
        image: z.string().optional(),
        eventDate: z.date(),
        location: z.string().max(255).optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, id: 1 };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.any(),
        title: z.string().min(3).max(500),
        description: z.string().optional(),
        image: z.string().optional(),
        eventDate: z.date(),
        location: z.string().max(255).optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.any() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});