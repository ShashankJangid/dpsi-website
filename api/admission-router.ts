import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, getInsertId } from "./queries/connection";
import { admissions } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const admissionRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        studentName: z.string().min(2).max(255),
        parentName: z.string().min(2).max(255),
        email: z.string().email(),
        phone: z.string().min(10).max(20),
        grade: z.string().min(1).max(50),
        dob: z.string().min(1).max(50),
        address: z.string().min(5),
        city: z.string().min(2).max(100),
        state: z.string().min(2).max(100),
        pincode: z.string().min(4).max(20),
        previousSchool: z.string().max(255).optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(admissions).values(input);
      return { success: true, id: getInsertId(result) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(admissions).orderBy(desc(admissions.createdAt));
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db
        .select()
        .from(admissions)
        .where(eq(admissions.id, input.id))
        .limit(1);
      return results[0] ?? null;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewing", "approved", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(admissions)
        .set({ status: input.status })
        .where(eq(admissions.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(admissions).where(eq(admissions.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(admissions);
    return {
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      approved: all.filter((a) => a.status === "approved").length,
    };
  }),
});