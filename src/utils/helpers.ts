import { categoryColorClass } from "../data/config";

export function getCategoryClass(cat: string) {
  return (categoryColorClass as Record<string, string>)[cat] || "";
}

export function formatDeadline(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const formatted = `${date.getDate()} ${months[date.getMonth()]}`;
  return { text: formatted, isSoon: diffDays <= 7 && diffDays >= 0, isPast: diffDays < 0 };
}

export function declension(n: number, forms: string[]) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

export function getDirections(item: IInternship) {
  if (Array.isArray(item.directions) && item.directions.length > 0) return item.directions;
  if (item.category) return [{ category: item.category, subcategory: item.subcategory }];
  return [];
}

export function getCityDisplay(item: IInternship, maxCount?: number) {
  const cities = Array.isArray(item.city) ? item.city : (item.city ? [item.city] : []);
  if (cities.length === 0) return "";
  if (typeof maxCount === "number" && cities.length > maxCount) {
    return `${cities.length} ${declension(cities.length, ["город", "города", "городов"])}`;
  }
  return cities.join(", ");
}

export function computeAllCities(internships: IInternship[]) {
  return [...new Set(internships.flatMap(i =>
    Array.isArray(i.city) ? i.city : (i.city ? [i.city] : [])
  ))].sort((a, b) => a.localeCompare(b, "ru"));
}

export function computeAllCompanies(internships: IInternship[]) {
  return [...new Set(internships.map(i => i.company))].sort((a, b) => a.localeCompare(b, "ru"));
}
