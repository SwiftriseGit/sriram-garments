/**
 * Generate customer avatar initials:
 * First letter of first word + first letter of second word (if exists in customer name).
 *
 * Examples:
 * - "Sunil Maharana" -> "SM"
 * - "Sunil" -> "S"
 * - "Amit Pattnaik" -> "AP"
 */
export function getCustomerInitials(name?: string | null): string {
  if (!name) return "U";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

/**
 * Generate a deterministic smooth pastel background for an avatar based on name.
 */
export function getAvatarColor(name?: string | null): { bg: string; text: string } {
  const colors = [
    { bg: "bg-orange-100 text-orange-700 border-orange-200", text: "text-orange-700" },
    { bg: "bg-amber-100 text-amber-700 border-amber-200", text: "text-amber-700" },
    { bg: "bg-emerald-100 text-emerald-700 border-emerald-200", text: "text-emerald-700" },
    { bg: "bg-blue-100 text-blue-700 border-blue-200", text: "text-blue-700" },
    { bg: "bg-indigo-100 text-indigo-700 border-indigo-200", text: "text-indigo-700" },
    { bg: "bg-purple-100 text-purple-700 border-purple-200", text: "text-purple-700" },
    { bg: "bg-rose-100 text-rose-700 border-rose-200", text: "text-rose-700" },
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

