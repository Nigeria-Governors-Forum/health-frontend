export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const NAME_OVERRIDES: Record<string, string> = {
  fct: "fct",
  "federal capital territory": "fct",
  "abuja federal capital territory": "fct",
  "akwa-ibom": "akwa-ibom",
  "akwa ibom": "akwa-ibom",
  "cross-river": "cross-river",
  "cross river": "cross-river",
  nasarawa: "nasarawa",
  nassarawa: "nasarawa",
};

export function normalizeStateName(name: string): string {
  const key = name.trim().toLowerCase();
  if (NAME_OVERRIDES[key]) return NAME_OVERRIDES[key];
  return slugify(name);
}
