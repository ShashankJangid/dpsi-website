import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Ensure resilient DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore in environments where setting DNS servers is restricted
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not set in environment variables.");
}


interface MongoCache {
  connections: {
    main: mongoose.Connection | null;
    gallery: mongoose.Connection | null;
    tc: mongoose.Connection | null;
  };
  promises: {
    main: Promise<mongoose.Connection> | null;
    gallery: Promise<mongoose.Connection> | null;
    tc: Promise<mongoose.Connection> | null;
  };
}

declare global {
  var _mongoCache: MongoCache | undefined;
}

const cached: MongoCache = global._mongoCache || {
  connections: { main: null, gallery: null, tc: null },
  promises: { main: null, gallery: null, tc: null },
};

if (!global._mongoCache) {
  global._mongoCache = cached;
}

export async function getDbConnection(dbName: "dpsi_main" | "dpsi_gallery" | "dpsi_tc"): Promise<mongoose.Connection> {
  const key = dbName === "dpsi_main" ? "main" : dbName === "dpsi_gallery" ? "gallery" : "tc";

  // 1. Return active cached connection if ready
  if (cached.connections[key] && cached.connections[key]!.readyState === 1) {
    return cached.connections[key]!;
  }

  // 2. Return pending connection promise if already in flight
  if (cached.promises[key]) {
    try {
      const conn = await cached.promises[key]!;
      if (conn.readyState === 1) return conn;
    } catch {
      cached.promises[key] = null;
    }
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  // 3. Construct database-specific URI
  let uri = MONGODB_URI.trim();
  if (uri.includes("?")) {
    const [base, query] = uri.split("?");
    const cleanBase = base.replace(/\/+$/, "");
    uri = `${cleanBase}/${dbName}?${query}`;
  } else {
    uri = `${uri.replace(/\/+$/, "")}/${dbName}`;
  }

  // 4. Initiate single connection promise
  cached.promises[key] = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    tls: true,
  }).asPromise();

  try {
    const conn = await cached.promises[key]!;
    cached.connections[key] = conn;
    cached.promises[key] = null;

    conn.on("error", (err) => {
      console.error(`MongoDB [${dbName}] connection error:`, err.message);
    });

    conn.on("disconnected", () => {
      console.warn(`MongoDB [${dbName}] disconnected. Clearing connection cache.`);
      cached.connections[key] = null;
      cached.promises[key] = null;
    });

    return conn;
  } catch (err) {
    cached.promises[key] = null;
    cached.connections[key] = null;
    throw err;
  }
}
