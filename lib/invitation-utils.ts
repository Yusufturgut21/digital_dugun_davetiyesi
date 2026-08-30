import { Invitation } from "./models/Invitation";
import { SAHRA_VENUE_FIELDS } from "./constants/sahra";

export function serializeInvitation(inv: Record<string, unknown>): Record<string, unknown> {
  const obj = { ...inv };
  if (obj._id) {
    obj.id = (obj._id as { toString(): string }).toString();
    delete obj._id;
  }
  if (obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt instanceof Date) obj.updatedAt = obj.updatedAt.toISOString();
  // Her zaman Sahra konumunu göster
  Object.assign(obj, SAHRA_VENUE_FIELDS);
  return obj;
}

export async function ensureSahraVenueOnInvitation(invitationId: string) {
  await Invitation.findByIdAndUpdate(invitationId, { $set: SAHRA_VENUE_FIELDS });
}
