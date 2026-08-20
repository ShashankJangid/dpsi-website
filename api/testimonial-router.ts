import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const testimonialRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Testimonial } = await getMainModels();
      const docs = await Testimonial.find({ isDeleted: false, isActive: true }).sort({ order: 1, createdAt: -1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        name: d.name,
        role: d.role,
        content: d.content,
        avatar: d.avatarUrl || "",
        avatarUrl: d.avatarUrl || "",
        rating: d.rating || 5,
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
      const { Testimonial } = await getMainModels();
      const docs = await Testimonial.find({ isDeleted: false, isActive: true, featured: true }).sort({ order: 1 });
      return docs.map((d: any) => ({
        id: d._id.toString(),
        _id: d._id.toString(),
        name: d.name,
        role: d.role,
        content: d.content,
        avatar: d.avatarUrl || "",
        avatarUrl: d.avatarUrl || "",
        rating: d.rating || 5,
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
        name: z.string().min(2).max(255),
        role: z.string().min(2).max(255),
        content: z.string().min(5),
        avatarUrl: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
        featured: z.boolean().default(true),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const { Testimonial } = await getMainModels();
      const doc = await Testimonial.create(input);
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(255),
        role: z.string().min(2).max(255),
        content: z.string().min(5),
        avatarUrl: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
        featured: z.boolean().default(true),
        order: z.number().default(0),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const { Testimonial } = await getMainModels();
      await Testimonial.findByIdAndUpdate(id, data);
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Testimonial } = await getMainModels();
      await Testimonial.findByIdAndUpdate(input.id, { isDeleted: true });
      return { success: true };
    }),
});