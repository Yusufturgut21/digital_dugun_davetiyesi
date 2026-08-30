import mongoose, { Schema, Document } from "mongoose";

export type RSVPAttendance = "yes" | "no" | "maybe";

export interface RSVPDocument extends Document {
  invitationId: mongoose.Types.ObjectId;
  guestName: string;
  phone?: string;
  guestCount: number;
  attendance: RSVPAttendance;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RSVPSchema = new Schema<RSVPDocument>(
  {
    invitationId: { type: Schema.Types.ObjectId, ref: "Invitation", required: true, index: true },
    guestName: { type: String, required: true },
    phone: String,
    guestCount: { type: Number, default: 1, min: 1 },
    attendance: { type: String, enum: ["yes", "no", "maybe"], default: "yes" },
    note: String,
  },
  { timestamps: true }
);

export const RSVP =
  mongoose.models.RSVP || mongoose.model<RSVPDocument>("RSVP", RSVPSchema);
