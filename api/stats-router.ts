import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { stats } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const statsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(stats)
      .where(eq(stats.active, true))
      .orderBy(asc(stats.order));
  }),

  adminList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(stats).orderBy(asc(stats.order));
  }),

  create: adminQuery
    .input(
      z.object({
        label: z.string().min(2).max(255),
        value: z.string().min(1).max(100),
        icon: z.string().max(100).optional(),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(stats).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        label: z.string().min(2).max(255),
        value: z.string().min(1).max(100),
        icon: z.string().max(100).optional(),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(stats).set(data).where(eq(stats.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(stats).where(eq(stats.id, input.id));
      return { success: true };
    }),
});