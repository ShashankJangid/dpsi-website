import { createRouter, authedQuery } from "./middleware";

export const authRouter = createRouter({
  me: authedQuery.query(() => ({ id: 1, name: "Admin", role: "admin" as const })),
  logout: authedQuery.mutation(async () => {
    return { success: true };
  }),
});