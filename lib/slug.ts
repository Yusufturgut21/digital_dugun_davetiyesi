function normalizeSlugPart(s: string): string {
  return s
    .replace(/İ/g, "i").replace(/Ğ/g, "g").replace(/Ü/g, "u")
    .replace(/Ş/g, "s").replace(/I/g, "i").replace(/Ö/g, "o").replace(/Ç/g, "c")
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function generateSlug(name: string): string {
  return normalizeSlugPart(name) || `slug-${Date.now()}`;
}

export async function generateUniqueSlug(
  groomName: string,
  brideName: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = `${normalizeSlugPart(groomName)}-${normalizeSlugPart(brideName)}` || `davet-${Date.now()}`;
  const year = new Date().getFullYear();
  let slug = base;
  let counter = 1;

  while (await exists(slug)) {
    slug = counter === 1 ? `${base}-${year}` : `${base}-${year}-${counter}`;
    counter++;
  }
  return slug;
}
