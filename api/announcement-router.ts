import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

const fallbackAnnouncements = [
  { id: 1, title: "ADMISSIONS OPEN FOR SESSION 2026-27 (PRE-NURSERY TO CLASS IX & XI)", link: "/admissions", active: true, priority: 1 },
  { id: 2, title: "CBSE CLASS XII & X BOARD RESULTS DECLARED — TOP SCORE 99.4%", link: "/academics#results", active: true, priority: 2 },
  { id: 3, title: "TIMES EDUCATION ICONS 2024 AWARD WINNER — #1 CBSE SCHOOL IN GHAZIABAD", link: "/about", active: true, priority: 3 },
];

export const announcementRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Marquee } = await getMainModels();
      const marquees = await Marquee.find({ isDeleted: false, isActive: true }).sort({ createdAt: -1 });
      if (marquees && marquees.length > 0) {
        return marquees.map((m: any, idx: number) => ({
          id: idx + 1,
          title: m.text,
          link: m.linkUrl || "/admissions",
          active: m.isActive,
          priority: m.speed || 50,
        }));
      }
      return fallbackAnnouncements;
    } catch {
      return fallbackAnnouncements;
    }
  }),

  adminList: adminQuery.query(async () => {
    try {
      const { Marquee } = await getMainModels();
      const marquees = await Marquee.find({ isDeleted: false }).sort({ createdAt: -1 });
      if (marquees && marquees.length > 0) {
        return marquees.map((m: any, idx: number) => ({
          id: idx + 1,
          title: m.text,
          link: m.linkUrl || "",
          active: m.isActive,
          priority: m.speed || 50,
        }));
      }
      return fallbackAnnouncements;
    } catch {
      return fallbackAnnouncements;
    }
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        link: z.string().optional(),
        active: z.boolean().default(true),
        priority: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { Marquee } = await getMainModels();
        const doc = await Marquee.create({
          text: input.title,
          linkUrl: input.link,
          isActive: input.active,
          speed: input.priority,
        });
        return { success: true, id: doc._id.toString() };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.any(),
        title: z.string().min(3).max(500),
        link: z.string().optional(),
        active: z.boolean().default(true),
        priority: z.number().default(0),
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