import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";

export const contactRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        phone: z.string().max(20).optional(),
        subject: z.string().max(255).optional(),
        message: z.string().min(5),
      })
    )
    .mutation(async ({ input }) => {
      return { success: true, id: 1 };
    }),

  list: adminQuery.query(async () => {
    return [];
  }),

  markRead: adminQuery
    .input(z.object({ id: z.any() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.any() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});