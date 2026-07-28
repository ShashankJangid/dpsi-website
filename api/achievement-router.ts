import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { achievements } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const achievementRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(achievements).orderBy(desc(achievements.createdAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(achievements)
      .where(eq(achievements.featured, true))
      .orderBy(desc(achievements.createdAt))
      .limit(10);
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
      const db = getDb();
      const result = await db.insert(achievements).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
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
      const db = getDb();
      const { id, ...data } = input;
      await db.update(achievements).set(data).where(eq(achievements.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(achievements).where(eq(achievements.id, input.id));
      return { success: true };
    }),
});