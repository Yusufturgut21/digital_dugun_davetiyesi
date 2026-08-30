import mongoose, { Schema, Document } from "mongoose";

export interface AuditLogDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  username?: string;
  invitationId?: mongoose.Types.ObjectId;
  action: string;
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username: String,
    invitationId: { type: Schema.Types.ObjectId, ref: "Invitation" },
    action: { type: String, required: true },
    details: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ invitationId: 1 });

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model<AuditLogDocument>("AuditLog", AuditLogSchema);

export async function logAudit(params: {
  userId?: string;
  username?: string;
  invitationId?: string;
  action: string;
  details?: string;
}) {
  const { connectDB } = await import("../mongodb");
  await connectDB();
  await AuditLog.create({
    userId: params.userId,
    username: params.username,
    invitationId: params.invitationId,
    action: params.action,
    details: params.details,
  });
}
