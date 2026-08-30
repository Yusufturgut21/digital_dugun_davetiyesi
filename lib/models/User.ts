import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../auth/jwt";

export type UserStatus = "active" | "inactive";

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  role: UserRole;
  invitationId?: mongoose.Types.ObjectId;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["super_admin", "couple"], required: true },
    invitationId: { type: Schema.Types.ObjectId, ref: "Invitation", index: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
