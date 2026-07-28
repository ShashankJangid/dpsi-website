import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { news } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const newsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(news)
      .where(eq(news.published, true))
      .orderBy(desc(news.createdAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(news)
      .where(eq(news.featured, true))
      .orderBy(desc(news.createdAt))
      .limit(3);
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(news)
        .where(eq(news.slug, input.slug))
        .limit(1);
      return results[0] ?? null;
    }),

  adminList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(news).orderBy(desc(news.createdAt));
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        slug: z.string().min(3).max(500),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(news).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).max(500),
        slug: z.string().min(3).max(500),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        image: z.string().optional(),
        category: z.string().optional(),
        published: z.boolean().default(true),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),
});