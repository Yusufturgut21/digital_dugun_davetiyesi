import { WeddingInvitation, CreateInvitationInput } from "./types";

const base = () =>
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export async function getAllInvitations(): Promise<WeddingInvitation[]> {
  const res = await fetch(`${base()}/api/invitations`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getInvitationById(id: string): Promise<WeddingInvitation | null> {
  const res = await fetch(`${base()}/api/invitations/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getInvitationBySlug(slug: string): Promise<WeddingInvitation | null> {
  const res = await fetch(`${base()}/api/invitations?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function createInvitation(input: CreateInvitationInput): Promise<WeddingInvitation> {
  const res = await fetch(`${base()}/api/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function updateInvitation(id: string, updates: Partial<WeddingInvitation>): Promise<WeddingInvitation | null> {
  const res = await fetch(`${base()}/api/invitations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteInvitation(id: string): Promise<boolean> {
  const res = await fetch(`${base()}/api/invitations/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function toggleInvitationStatus(id: string): Promise<WeddingInvitation | null> {
  const inv = await getInvitationById(id);
  if (!inv) return null;
  return updateInvitation(id, { isActive: !inv.isActive });
}
