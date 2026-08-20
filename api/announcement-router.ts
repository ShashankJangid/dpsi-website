import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const announcementRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Marquee } = await getMainModels();
      const marquees = await Marquee.find({ isDeleted: false, isActive: true }).sort({ createdAt: -1 });
      return marquees.map((m: any, idx: number) => ({
        id: m._id?.toString() || idx + 1,
        title: m.text,
        link: m.linkUrl || "/admissions",
        active: m.isActive,
        priority: m.speed || 50,
      }));
    } catch {
      return [];
    }
  }),

  adminList: adminQuery.query(async () => {
    try {
      const { Marquee } = await getMainModels();
      const marquees = await Marquee.find({ isDeleted: false }).sort({ createdAt: -1 });
      return marquees.map((m: any, idx: number) => ({
        id: m._id?.toString() || idx + 1,
        title: m.text,
        link: m.linkUrl || "",
        active: m.isActive,
        priority: m.speed || 50,
      }));
    } catch {
      return [];
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
      const { Marquee } = await getMainModels();
      const doc = await Marquee.create({
        text: input.title,
        linkUrl: input.link,
        isActive: input.active,
        speed: input.priority,
      });
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).max(500),
        link: z.string().optional(),
        active: z.boolean().default(true),
        priority: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      await Marquee.findByIdAndUpdate(input.id, {
        text: input.title,
        linkUrl: input.link,
        isActive: input.active,
        speed: input.priority,
      });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Marquee } = await getMainModels();
      await Marquee.findByIdAndUpdate(input.id, { isDeleted: true });
      return { success: true };
    }),
});