import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";

const fallbackStats = [
  { id: 1, label: "Students Enrolled", value: "3,500+", icon: "GraduationCap", order: 1, active: true },
  { id: 2, label: "CBSE Board Average", value: "88.6%", icon: "Award", order: 2, active: true },
  { id: 3, label: "Expert Educators", value: "220+", icon: "Users", order: 3, active: true },
  { id: 4, label: "Campus Area", value: "10 Acres", icon: "Building", order: 4, active: true },
];

export const statsRouter = createRouter({
  list: publicQuery.query(async () => {
    return fallbackStats;
  }),

  adminList: adminQuery.query(async () => {
    return fallbackStats;
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
      return { success: true, id: 1 };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.any(),
        label: z.string().min(2).max(255),
        value: z.string().min(1).max(100),
        icon: z.string().max(100).optional(),
        order: z.number().default(0),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.any() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});