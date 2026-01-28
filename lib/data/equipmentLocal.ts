import type { EquipmentItem } from "@/lib/api/types";

const items: EquipmentItem[] = [
  {
    id: 1,
    name: "Power Tiller",
    description: "Compact tiller suitable for small farms",
    type: "Tiller",
    price_per_day: 1200,
    location: "Pune",
    is_available: true,
  },
  {
    id: 2,
    name: "Sprayer (16L)",
    description: "Battery sprayer for pesticides",
    type: "Sprayer",
    price_per_day: 250,
    location: "Nashik",
    is_available: true,
  },
  {
    id: 3,
    name: "Tractor (45 HP)",
    description: "Heavy duty for ploughing",
    type: "Tractor",
    price_per_day: 3500,
    location: "Aurangabad",
    is_available: true,
  },
];

export function getEquipment(location?: string): EquipmentItem[] {
  const q = (location || "").trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => (i.location || "").toLowerCase().includes(q));
}
