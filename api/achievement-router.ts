import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const achievementRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Achievement } = await getMainModels();
      const docs = await Achievement.find({ isDeleted: false, isActive: true }).sort({ order: 1, createdAt: -1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        studentName: d.studentName,
        class: d.className,
        className: d.className,
        score: d.score,
        exam: d.exam,
        stream: d.stream || "",
        rank: d.rank || "",
        year: d.year,
        image: d.imageUrl || "",
        imageUrl: d.imageUrl || "",
        featured: d.featured,
        order: d.order,
        isActive: d.isActive,
      }));
    } catch {
      return [];
    }
  }),

  featured: publicQuery.query(async () => {
    try {
      const { Achievement } = await getMainModels();
      const docs = await Achievement.find({ isDeleted: false, isActive: true, featured: true }).sort({ order: 1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        studentName: d.studentName,
        class: d.className,
        className: d.className,
        score: d.score,
        exam: d.exam,
        stream: d.stream || "",
        rank: d.rank || "",
        year: d.year,
        image: d.imageUrl || "",
        imageUrl: d.imageUrl || "",
        featured: d.featured,
        order: d.order,
      }));
    } catch {
      return [];
    }
  }),

  create: adminQuery
    .input(
      z.object({
        studentName: z.string().min(2).max(255),
        className: z.string().min(1).max(50),
        score: z.string().min(1).max(50),
        exam: z.string().min(1).max(100),
        stream: z.string().optional(),
        rank: z.string().optional(),
        imageUrl: z.string().optional(),
        year: z.string().min(4).max(20).default("2025-26"),
        featured: z.boolean().default(true),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Achievement } = await getMainModels();
      const doc = await Achievement.create(input);
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        studentName: z.string().min(2).max(255),
        className: z.string().min(1).max(50),
        score: z.string().min(1).max(50),
        exam: z.string().min(1).max(100),
        stream: z.string().optional(),
        rank: z.string().optional(),
        imageUrl: z.string().optional(),
        year: z.string().min(4).max(20).default("2025-26"),
        featured: z.boolean().default(true),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Achievement } = await getMainModels();
      await Achievement.findByIdAndUpdate(id, data);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Achievement } = await getMainModels();
      await Achievement.findByIdAndUpdate(input.id, { isDeleted: true });
      return { success: true };
    }),
});