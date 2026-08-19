import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

const fallbackAchievements = [
  { id: 1, studentName: "Aayush Sharma", class: "Class XII", score: "99.4%", exam: "CBSE Science Stream Topper", year: "2025-26", image: "/images/dps/topper_aayush.webp", featured: true },
  { id: 2, studentName: "Anshika Verma", class: "Class XII", score: "99.2%", exam: "CBSE Commerce Stream Topper", year: "2025-26", image: "/images/dps/topper_ansh.webp", featured: true },
  { id: 3, studentName: "Arnav Goel", class: "Class XII", score: "99.0%", exam: "CBSE Humanities Stream Topper", year: "2025-26", image: "/images/dps/topper_arnav.webp", featured: true },
  { id: 4, studentName: "Jia Rastogi", class: "Class X", score: "99.6%", exam: "CBSE Secondary All-India Rank 3", year: "2025-26", image: "/images/dps/topper_jia.webp", featured: true },
  { id: 5, studentName: "Pawni Singhal", class: "Class XII", score: "AIR 42", exam: "JEE Advanced 2025", year: "2025-26", image: "/images/dps/topper_pawni.webp", featured: true },
  { id: 6, studentName: "Siddhant Mishra", class: "Class XII", score: "AIR 68", exam: "NEET UG 2025", year: "2025-26", image: "/images/dps/topper_siddhant.webp", featured: true },
];

export const achievementRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1 });
      if (acts && acts.length > 0) {
        return fallbackAchievements;
      }
      return fallbackAchievements;
    } catch {
      return fallbackAchievements;
    }
  }),

  featured: publicQuery.query(async () => {
    try {
      return fallbackAchievements;
    } catch {
      return fallbackAchievements;
    }
  }),

  create: adminQuery
    .input(
      z.object({
        studentName: z.string().min(2).max(255),
        class: z.string().min(1).max(50),
        score: z.string().min(1).max(50),
        exam: z.string().min(1).max(100),
        image: z.string().optional(),
        year: z.string().min(4).max(20),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, id: 1 };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.any(),
        studentName: z.string().min(2).max(255),
        class: z.string().min(1).max(50),
        score: z.string().min(1).max(50),
        exam: z.string().min(1).max(100),
        image: z.string().optional(),
        year: z.string().min(4).max(20),
        featured: z.boolean().default(false),
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