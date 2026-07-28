import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { announcements } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const announcementRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(announcements)
      .where(eq(announcements.active, true))
      .orderBy(desc(announcements.priority));
  }),

  adminList: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(announcements).orderBy(desc(announcements.priority));
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
      const db = getDb();
      const result = await db.insert(announcements).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).max(500),
        link: z.string().optional(),
        active: z.boolean().default(true),
        priority: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(announcements).set(data).where(eq(announcements.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(announcements).where(eq(announcements.id, input.id));
      return { success: true };
    }),
});