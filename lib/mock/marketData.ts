export const NEARBY_MARKETS = [
  {
    id: "m1",
    name: "Nashik APMC Market",
    distance: "12 km",
    location: "Nashik, MH",
    latitude: 19.9975,
    longitude: 73.7898,
    isOpen: true,
    commodities: [
      { name: "Onion", price: "₹2,200/qt", trend: "up" },
      { name: "Tomato", price: "₹1,800/qt", trend: "down" }
    ]
  },
  {
    id: "m2",
    name: "Lasalgaon Onion Mandi",
    distance: "24 km",
    location: "Lasalgaon, MH",
    latitude: 20.1421,
    longitude: 74.2401,
    isOpen: true,
    commodities: [
      { name: "Onion", price: "₹2,450/qt", trend: "up" },
      { name: "Garlic", price: "₹8,000/qt", trend: "stable" }
    ]
  },
  {
    id: "m3",
    name: "Vashi Market",
    distance: "140 km",
    location: "Mumbai, MH",
    latitude: 19.0728,
    longitude: 73.0004,
    isOpen: false,
    commodities: [
      { name: "Potato", price: "₹1,500/qt", trend: "stable" }
    ]
  }
];

export const DIGITAL_BUYERS = [
  {
    id: "b1",
    name: "Amazon",
    logoUrl: "https://example.com/logos/amazon.png",
    rating: 4.5,
    reviews: 1200,
    location: "Online",
    commodities: [
      { name: "Fertilizers", priceRange: "₹500 - ₹5,000" },
      { name: "Seeds", priceRange: "₹100 - ₹2,000" }
    ]
  },
  { name: "Flipkart", logoUrl: "https://example.com/logos/flipkart.png", rating: 4.2, reviews: 800, location: "Online", commodities: [ { name: "Pesticides", priceRange: "₹300 - ₹3,000" }, { name: "Tools", priceRange: "₹200 - ₹4,000" } ] },
  {
    id: "b3",
    name: "Big Bazaar",
    logoUrl: "https://example.com/logos/bigbazaar.png",
    rating: 4.0,
    reviews: 500,
    location: "Multiple Cities",
    commodities: [
      { name: "Irrigation Equipment", priceRange: "₹1,000 - ₹10,000" }
    ]
  }
];