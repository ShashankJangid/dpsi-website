import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;
export const publicMutation = t.procedure;
export const authedQuery = t.procedure;
export const authedMutation = t.procedure;
export const adminQuery = t.procedure;
export const adminMutation = t.procedure;