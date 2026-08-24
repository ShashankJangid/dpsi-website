import mongoose, { Schema, Document } from "mongoose";
import { getDbConnection } from "../lib/mongodb";

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  role: "superadmin" | "admin" | "editor";
  lastLogin?: Date;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "admin" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export async function getAdminUserModel() {
  const conn = await getDbConnection("dpsi_admin");
  return conn.models.AdminUser || conn.model<IAdminUser>("AdminUser", AdminUserSchema);
}
