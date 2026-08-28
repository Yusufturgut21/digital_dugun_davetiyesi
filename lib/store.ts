import { WeddingInvitation, CreateInvitationInput } from "./types";

const STORAGE_KEY = "wedding_invitations";

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function generateSlug(brideName: string, groomName: string, existingSlugs: string[]): string {
  const base = `${groomName}-${brideName}`
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const year = new Date().getFullYear();
  let slug = base;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = counter === 1 ? `${base}-${year}` : `${base}-${year}-${counter}`;
    counter++;
  }
  return slug;
}

export function getAllInvitations(): WeddingInvitation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getInvitationById(id: string): WeddingInvitation | null {
  return getAllInvitations().find(i => i.id === id) ?? null;
}

export function getInvitationBySlug(slug: string): WeddingInvitation | null {
  return getAllInvitations().find(i => i.slug === slug) ?? null;
}

export function createInvitation(input: CreateInvitationInput): WeddingInvitation {
  const all = getAllInvitations();
  const slugs = all.map(i => i.slug);
  const now = new Date().toISOString();

  const invitation: WeddingInvitation = {
    ...input,
    id: generateId(),
    slug: generateSlug(input.brideName, input.groomName, slugs),
    createdAt: now,
    updatedAt: now,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, invitation]));
  return invitation;
}

export function updateInvitation(id: string, updates: Partial<WeddingInvitation>): WeddingInvitation | null {
  const all = getAllInvitations();
  const idx = all.findIndex(i => i.id === id);
  if (idx === -1) return null;

  const updated = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return updated;
}

export function deleteInvitation(id: string): boolean {
  const all = getAllInvitations();
  const filtered = all.filter(i => i.id !== id);
  if (filtered.length === all.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function toggleInvitationStatus(id: string): WeddingInvitation | null {
  const inv = getInvitationById(id);
  if (!inv) return null;
  return updateInvitation(id, { isActive: !inv.isActive });
}
