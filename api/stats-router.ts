import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const statsRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { QuickStat } = await getMainModels();
      const docs = await QuickStat.find({ isDeleted: false, isActive: true }).sort({ order: 1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        label: d.label,
        value: d.value,
        icon: d.icon || "GraduationCap",
        order: d.order,
        active: d.isActive,
      }));
    } catch {
      return [];
    }
  }),

  adminList: adminQuery.query(async () => {
    try {
      const { QuickStat } = await getMainModels();
      const docs = await QuickStat.find({ isDeleted: false }).sort({ order: 1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        label: d.label,
        value: d.value,
        icon: d.icon || "GraduationCap",
        order: d.order,
        active: d.isActive,
      }));
    } catch {
      return [];
    }
  }),

  create: adminQuery
    .input(
      z.object({
        label: z.string().min(2).max(255),
        value: z.string().min(1).max(100),
        icon: z.string().max(100).default("GraduationCap"),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { QuickStat } = await getMainModels();
      const doc = await QuickStat.create({
        label: input.label,
        value: input.value,
        icon: input.icon,
        order: input.order,
        isActive: input.active,
      });
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        label: z.string().min(2).max(255),
        value: z.string().min(1).max(100),
        icon: z.string().max(100).optional(),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { QuickStat } = await getMainModels();
      await QuickStat.findByIdAndUpdate(input.id, {
        label: input.label,
        value: input.value,
        icon: input.icon,
        order: input.order,
        isActive: input.active,
      });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { QuickStat } = await getMainModels();
      await QuickStat.findByIdAndDelete(input.id);
      return { success: true };
    }),
});