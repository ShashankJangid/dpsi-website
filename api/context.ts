import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  username: string;
  role: "superadmin" | "admin" | "editor";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user: AuthUser | null;
};

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  let user: AuthUser | null = null;

  // Extract JWT from Authorization header
  const authHeader = opts.req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };
    } catch {
      // Invalid/expired token — user remains null
    }
  }

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user,
  };
}