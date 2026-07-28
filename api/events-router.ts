import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { events } from "@db/schema";
import { eq, desc, gte } from "drizzle-orm";

export const eventsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(events)
      .where(gte(events.eventDate, new Date()))
      .orderBy(desc(events.eventDate));
  }),

  all: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(events).orderBy(desc(events.eventDate));
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(3).max(500),
        description: z.string().optional(),
        image: z.string().optional(),
        eventDate: z.date(),
        location: z.string().max(255).optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(events).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).max(500),
        description: z.string().optional(),
        image: z.string().optional(),
        eventDate: z.date(),
        location: z.string().max(255).optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(events).set(data).where(eq(events.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),
});