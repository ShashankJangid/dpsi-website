import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { gallery } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const galleryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(gallery).orderBy(desc(gallery.createdAt));
  }),

  byCategory: publicQuery
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(gallery)
        .where(eq(gallery.category, input.category))
        .orderBy(desc(gallery.createdAt));
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(gallery)
      .where(eq(gallery.featured, true))
      .orderBy(desc(gallery.createdAt))
      .limit(6);
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(2).max(255),
        description: z.string().optional(),
        imageUrl: z.string().min(1),
        videoUrl: z.string().optional(),
        category: z.string().min(1).max(100),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(gallery).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2).max(255),
        description: z.string().optional(),
        imageUrl: z.string().min(1),
        videoUrl: z.string().optional(),
        category: z.string().min(1).max(100),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(gallery).set(data).where(eq(gallery.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(gallery).where(eq(gallery.id, input.id));
      return { success: true };
    }),
});