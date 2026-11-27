// ============================================================
// data.js — ALL the fake data for your prototype lives here.
//
// There is no database. Everything below is made up, and that is
// on purpose: never put real people's names, emails, phone numbers
// or addresses in this file.
//
// To change what appears on the Explore page, edit LISTINGS.
// Each item is one card. Keep the same fields (id, name, category,
// description) or ask Copilot to add new ones everywhere they're needed.
// ============================================================

const STARTUP = {
  name: "Move Out Market",
  tagline: "Move Out Market",
  pitch: "Buy and sell used furniture and dorm essentials during move-out."
};

const LISTINGS = [
  { id: 1, name: "Desk", category: "Furniture", price: 25, deadline: "2026-12-15", condition: 4, description: "A used desk for study and dorm work.", seller: "Alex", image: "assets/desk.svg" },
  { id: 2, name: "Mini Fridge", category: "Dorm essentials", price: 45, deadline: "2026-12-18", condition: 5, description: "A compact mini fridge for move-out season.", seller: "Sam", image: "assets/mini-fridge.svg" },
  { id: 3, name: "Lamp", category: "Dorm essentials", price: 10, deadline: "2026-12-12", condition: 3, description: "A small used lamp for reading and studying.", seller: "Jordan", image: "assets/lamp.svg" },
  { id: 4, name: "Wooden Chair", category: "Furniture", price: 18, deadline: "2026-12-14", condition: 4, description: "A sturdy wooden chair in good used condition.", seller: "Morgan", image: "assets/desk.svg" },
  { id: 5, name: "Bookshelf", category: "Furniture", price: 32, deadline: "2026-12-16", condition: 3, description: "A compact bookshelf that fits well in a dorm room.", seller: "Taylor", image: "assets/desk.svg" },
  { id: 6, name: "Bedside Table", category: "Furniture", price: 20, deadline: "2026-12-19", condition: 4, description: "Small bedside table with one storage drawer.", seller: "Riley", image: "assets/desk.svg" },
  { id: 7, name: "Dorm Fan", category: "Dorm essentials", price: 12, deadline: "2026-12-11", condition: 4, description: "Quiet desktop fan with adjustable speed settings.", seller: "Casey", image: "assets/lamp.svg" },
  { id: 8, name: "Laundry Basket", category: "Dorm essentials", price: 8, deadline: "2026-12-13", condition: 5, description: "Lightweight laundry basket with built-in handles.", seller: "Jamie", image: "assets/mini-fridge.svg" },
  { id: 9, name: "Power Strip", category: "Electronics", price: 14, deadline: "2026-12-17", condition: 5, description: "Six-outlet power strip for dorm electronics.", seller: "Quinn", image: "assets/lamp.svg" },
  { id: 10, name: "Bluetooth Speaker", category: "Electronics", price: 28, deadline: "2026-12-20", condition: 4, description: "Portable Bluetooth speaker with charging cable.", seller: "Avery", image: "assets/lamp.svg" },
  { id: 11, name: "Winter Coat", category: "Clothing", price: 35, deadline: "2026-12-21", condition: 4, description: "Warm winter coat, recently cleaned and in good shape.", seller: "Cameron", image: "assets/desk.svg" },
  { id: 12, name: "Running Shoes", category: "Clothing", price: 22, deadline: "2026-12-18", condition: 3, description: "Used running shoes in men's size 10.", seller: "Drew", image: "assets/desk.svg" },
  { id: 13, name: "Calculus Textbook", category: "Books", price: 40, deadline: "2026-12-15", condition: 4, description: "Calculus textbook with minimal highlighting.", seller: "Skylar", image: "assets/desk.svg" },
  { id: 14, name: "Cooking Pot", category: "Kitchen", price: 16, deadline: "2026-12-14", condition: 5, description: "Medium cooking pot with lid, ideal for a dorm kitchen.", seller: "Emerson", image: "assets/mini-fridge.svg" },
  { id: 15, name: "Storage Bin Set", category: "Other", price: 24, deadline: "2026-12-22", condition: 5, description: "Set of three stackable storage bins.", seller: "Reese", image: "assets/mini-fridge.svg" }
];
