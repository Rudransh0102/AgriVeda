export type TipsByCategory = Record<string, string[]>;
export type TipsByCrop = Record<string, TipsByCategory>;

function norm(s: string) {
  return s.trim().toLowerCase();
}

const GENERAL: TipsByCategory = {
  "crop selection": [
    "Choose locally adapted, disease-resistant varieties",
    "Use certified seeds from trusted suppliers",
    "Match crop variety to season and region",
    "Check market demand and price trends",
    "Plan crop rotation to break pest cycles",
    "Avoid monocropping year after year",
    "Consider maturity duration for labour planning",
    "Verify seed viability with simple germination test",
  ],
  "soil preparation": [
    "Test soil pH and nutrients; amend based on results",
    "Incorporate well-decomposed compost or FYM",
    "Ensure fine tilth for good seed-soil contact",
    "Avoid over-tillage to preserve soil structure",
    "Create raised beds in poorly drained areas",
    "Remove previous crop residues harbouring pests",
    "Apply lime or gypsum if pH correction is needed",
    "Level field for uniform irrigation",
  ],
  irrigation: [
    "Irrigate early morning or late evening to reduce evaporation",
    "Follow crop-stage specific water schedules",
    "Use drip or sprinkler for efficient water use",
    "Avoid waterlogging; ensure proper drainage",
    "Mulch to conserve moisture and suppress weeds",
    "Check soil moisture before irrigating to prevent overwatering",
    "Install filters to keep drip lines unclogged",
    "Stagger irrigation to manage limited water",
  ],
  fertilizers: [
    "Base fertilizer doses on soil test recommendations",
    "Split nitrogen applications to reduce losses",
    "Place fertilizers near root zone, not broadcast blindly",
    "Include micronutrients if deficiency symptoms appear",
    "Use biofertilizers to improve nutrient uptake",
    "Avoid overuse; monitor leaf colour and growth",
    "Foliar feed during critical stages if needed",
    "Keep records of inputs and timings",
  ],
  "weed management": [
    "Mulch and timely hoeing to suppress weeds",
    "Use pre-emergent herbicides where appropriate",
    "Hand-weed during early stages to reduce competition",
    "Maintain clean field boundaries to reduce seed influx",
    "Rotate herbicide modes of action to avoid resistance",
    "Avoid spraying on windy days to reduce drift",
    "Calibrate sprayers for correct dosage",
    "Scout regularly and act early",
  ],
  harvesting: [
    "Harvest at proper maturity for best quality",
    "Avoid bruising; handle produce gently",
    "Dry grains to safe moisture before storage",
    "Sort and grade to fetch better market price",
    "Use clean crates; avoid jute bags for fresh produce",
    "Store in cool, ventilated place away from pests",
    "Plan transport to market during cooler hours",
    "Keep simple harvest records for profit analysis",
  ],
};

const CROPS: TipsByCrop = {
  tomato: {
    "crop selection": [
      "Prefer bacterial wilt and TYLCV tolerant hybrids",
      "Choose indeterminate types for stake training",
      "Opt for short-duration varieties in hot seasons",
    ],
    "soil preparation": [
      "Aim pH 6.0–7.0; add compost for structure",
      "Solarize nursery beds to reduce damping-off",
      "Prepare raised beds for better drainage",
    ],
    irrigation: [
      "Use drip with mulching; avoid wetting foliage",
      "Maintain uniform moisture to reduce blossom-end rot",
      "Irrigate deeply but infrequently",
    ],
    fertilizers: [
      "Apply basal NPK; supplement Ca to prevent BER",
      "Split nitrogen applications; add boron if flowers abort",
      "Use biofertilizers for better root vigour",
    ],
    "weed management": [
      "Plastic mulch reduces weeds and conserves moisture",
      "Hand-weed early; avoid root disturbance",
      "Keep alleys clean to prevent pest buildup",
    ],
    harvesting: [
      "Harvest at breaker stage for distant markets",
      "Grade by size and colour; avoid stacking heavy",
      "Cool quickly to extend shelf life",
    ],
  },
  rice: {
    "crop selection": [
      "Choose region-specific varieties (short/medium/long duration)",
      "Prefer blast and bacterial blight tolerant lines",
    ],
    "soil preparation": [
      "Puddle properly to reduce percolation",
      "Level field for uniform standing water",
    ],
    irrigation: [
      "Maintain 2–5 cm water depth during vegetative stage",
      "Adopt alternate wetting and drying to save water",
    ],
    fertilizers: [
      "Apply basal with Zn in deficient soils",
      "Top-dress N at tillering and panicle initiation",
    ],
    "weed management": [
      "Use pre-emergent herbicides within 3 days of transplanting",
      "Mechanical weeding with cono-weeder at 20–25 DAT",
    ],
    harvesting: [
      "Harvest at 20–22% grain moisture",
      "Dry to ~12–14% before storage",
    ],
  },
  wheat: {
    "crop selection": ["Select rust-resistant varieties suited to your zone"],
    "soil preparation": ["Fine tilth; ensure good seed-soil contact"],
    irrigation: [
      "Critical irrigations at crown root initiation, tillering, flowering",
    ],
    fertilizers: ["Apply N in splits; add S if deficient"],
    "weed management": [
      "Timely post-emergence herbicide to control Phalaris minor",
    ],
    harvesting: ["Harvest when grains hard and straw yellow"],
  },
  maize: {
    "crop selection": ["Use drought-tolerant hybrids for rainfed areas"],
    "soil preparation": ["Ridge and furrow system for drainage"],
    irrigation: ["Irrigate at knee-high and tasseling stages"],
    fertilizers: ["Band place fertilizers to reduce losses"],
    "weed management": ["Pre-emergent herbicide and timely hoeing"],
    harvesting: ["Harvest at ~25–30% grain moisture; dry to safe levels"],
  },
  potato: {
    "crop selection": ["Use virus-free seed tubers of uniform size"],
    "soil preparation": ["Light, well-drained soil; create ridges"],
    irrigation: ["Maintain moist soil; avoid waterlogging to prevent rot"],
    fertilizers: ["Adequate potash for tuber quality; split N"],
    "weed management": ["Mulch and early hoeing to protect young plants"],
    harvesting: ["Harvest when vines senesce; cure skins before storage"],
  },
  cotton: {
    "crop selection": ["Select Bt hybrids suitable for region"],
    "soil preparation": ["Deep ploughing to break hard pan"],
    irrigation: ["Avoid water stress during flowering and boll set"],
    fertilizers: ["Balanced NPK; add boron for boll development"],
    "weed management": ["Inter-cultivation and mulch to suppress weeds"],
    harvesting: ["Pick clean, dry bolls; avoid contamination"],
  },
  soybean: {
    "crop selection": ["High-yielding, shattering-resistant varieties"],
    "soil preparation": ["Well-drained soil; avoid salinity"],
    irrigation: ["Critical irrigations at flowering and pod fill"],
    fertilizers: ["Inoculate seeds with Rhizobium; moderate N"],
    "weed management": ["Pre/post-emergent herbicides; timely manual weeding"],
    harvesting: ["Harvest when pods brown; avoid shattering losses"],
  },
  sugarcane: {
    "crop selection": [
      "Choose early and mid-late varieties for staggered harvest",
    ],
    "soil preparation": ["Trench planting; improve drainage"],
    irrigation: ["Maintain moist soil; avoid standing water"],
    fertilizers: ["Split N; add micronutrients if leaves pale"],
    "weed management": ["Mulch and earthing-up to smother weeds"],
    harvesting: ["Harvest at peak sugar content; transport promptly"],
  },
  chilli: {
    "crop selection": ["Select viral disease tolerant hybrids"],
    "soil preparation": ["Raised beds with organic matter"],
    irrigation: ["Drip preferred; avoid wetting foliage"],
    fertilizers: ["Balanced NPK; add calcium to strengthen walls"],
    "weed management": ["Mulch; timely hand-weeding in rows"],
    harvesting: ["Harvest when fruits turn red; dry properly for storage"],
  },
  onion: {
    "crop selection": ["Choose bolting-resistant varieties"],
    "soil preparation": ["Loose, well-drained soil; add compost"],
    irrigation: ["Light, frequent irrigation; avoid waterlogging"],
    fertilizers: ["Adequate potash for bulb quality; split N"],
    "weed management": ["Mulch and shallow hoeing to protect roots"],
    harvesting: ["Cure bulbs; store in ventilated crates"],
  },
};

export function getLocalTips(crop: string, category: string): string[] {
  const c = norm(crop);
  const k = norm(category);
  const cropSet = CROPS[c];
  const general = GENERAL[k] || [];
  const specific = (cropSet && cropSet[k]) || [];
  // Combine specific overrides with general (unique items)
  const seen = new Set<string>();
  const combined = [...specific, ...general].filter((t) => {
    const key = t.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return combined.slice(0, 12);
}

export const TIPS_DATA = { GENERAL, CROPS };
