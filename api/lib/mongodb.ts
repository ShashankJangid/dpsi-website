import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not set in environment variables.");
}

interface MongoConnections {
  main: mongoose.Connection | null;
  gallery: mongoose.Connection | null;
  tc: mongoose.Connection | null;
}

declare global {
  var _mongoConnections: MongoConnections | undefined;
}

const cached: MongoConnections = global._mongoConnections || {
  main: null,
  gallery: null,
  tc: null,
};

if (!global._mongoConnections) {
  global._mongoConnections = cached;
}

export async function getDbConnection(dbName: "dpsi_main" | "dpsi_gallery" | "dpsi_tc"): Promise<mongoose.Connection> {
  const key = dbName === "dpsi_main" ? "main" : dbName === "dpsi_gallery" ? "gallery" : "tc";

  if (cached[key] && cached[key]!.readyState === 1) {
    return cached[key]!;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  // Ensure database name is cleanly injected into the URI
  let uri = MONGODB_URI.trim();
  if (uri.includes("?")) {
    const [base, query] = uri.split("?");
    const cleanBase = base.replace(/\/+$/, "");
    uri = `${cleanBase}/${dbName}?${query}`;
  } else {
    uri = `${uri.replace(/\/+$/, "")}/${dbName}`;
  }

  const conn = await mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    tls: true,
  }).asPromise();

  cached[key] = conn;
  return conn;
}
