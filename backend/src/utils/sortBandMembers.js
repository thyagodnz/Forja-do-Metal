export function sortBandMembers(members = []) {
  if (!Array.isArray(members)) return [];

  return [...members].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
  );
}