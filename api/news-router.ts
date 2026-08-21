import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getMainModels } from "./models/cmsSchemas";

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1, createdAt: -1 });
      return acts.map((a: any, idx: number) => ({
        id: a._id?.toString() || idx + 1,
        title: a.title,
        slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: a.description,
        content: a.description,
        image: a.imageUrl || "",
        category: a.category || "Campus",
        published: a.isPublished,
        featured: true,
        createdAt: a.eventDate || a.createdAt || new Date(),
      }));
    } catch {
      return [];
    }
  }),

  featured: publicQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false, isPublished: true }).sort({ eventDate: -1, createdAt: -1 }).limit(3);
      return acts.map((a: any, idx: number) => ({
        id: a._id?.toString() || idx + 1,
        title: a.title,
        slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: a.description,
        content: a.description,
        image: a.imageUrl || "",
        category: a.category || "Campus",
        published: a.isPublished,
        featured: true,
        createdAt: a.eventDate || a.createdAt || new Date(),
      }));
    } catch {
      return [];
    }
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const { Activity } = await getMainModels();
        const acts = await Activity.find({ isDeleted: false, isPublished: true });
        const matched = acts.find((a: any) => {
          const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return slug === input.slug;
        });
        if (matched) {
          return {
            id: matched._id?.toString(),
            title: matched.title,
            slug: input.slug,
            excerpt: matched.description,
            content: matched.description,
            image: matched.imageUrl || "",
            category: matched.category || "Campus",
            published: matched.isPublished,
            featured: true,
            createdAt: matched.eventDate || matched.createdAt || new Date(),
          };
        }
        return null;
      } catch {
        return null;
      }
    }),

  adminList: adminQuery.query(async () => {
    try {
      const { Activity } = await getMainModels();
      const acts = await Activity.find({ isDeleted: false }).sort({ eventDate: -1, createdAt: -1 });
      return acts.map((a: any) => ({
        id: a._id?.toString(),
        title: a.title,
        excerpt: a.description,
        content: a.description,
        image: a.imageUrl || "",
        category: a.category || "Campus",
        published: a.isPublished,
        createdAt: a.eventDate || a.createdAt || new Date(),
      }));
    } catch {
      return [];
    }
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().min(5),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      const doc = await Activity.create({
        title: input.title,
        description: input.content || input.excerpt || "",
        imageUrl: input.image || "",
        category: input.category || "News",
        isPublished: input.published,
      });
      return { success: true, id: doc._id.toString() };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).max(500),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().min(5),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      await Activity.findByIdAndUpdate(input.id, {
        title: input.title,
        description: input.content || input.excerpt || "",
        imageUrl: input.image,
        category: input.category,
        isPublished: input.published,
      });
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { Activity } = await getMainModels();
      await Activity.findByIdAndDelete(input.id);
      return { success: true };
    }),
});