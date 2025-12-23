export function isDigitsOnly(value: string): boolean {
  if (typeof value !== "string") return false;
  return /^\d+$/.test(value);
}
