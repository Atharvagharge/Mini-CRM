// backend/seed.js

const mongoose = require("mongoose");
const Customer = require("./src/models/Customer"); // <-- adjust path if different

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mini-crm");

    // Clear old customers
    await Customer.deleteMany({});

    // Insert 20 demo customers
    await Customer.insertMany([
      { name: "Alice", email: "alice@example.com", totalSpend: 2000, visits: 5, lastOrderDate: new Date() },
      { name: "Bob", email: "bob@example.com", totalSpend: 500, visits: 2, lastOrderDate: new Date("2024-05-01") },
      { name: "Charlie", email: "charlie@example.com", totalSpend: 1500, visits: 7, lastOrderDate: new Date("2025-01-15") },
      { name: "David", email: "david@example.com", totalSpend: 3000, visits: 10, lastOrderDate: new Date("2025-08-01") },
      { name: "Eva", email: "eva@example.com", totalSpend: 12000, visits: 20, lastOrderDate: new Date("2025-09-01") },
      { name: "Frank", email: "frank@example.com", totalSpend: 800, visits: 3, lastOrderDate: new Date("2024-12-20") },
      { name: "Grace", email: "grace@example.com", totalSpend: 7000, visits: 15, lastOrderDate: new Date("2025-07-15") },
      { name: "Helen", email: "helen@example.com", totalSpend: 2500, visits: 8, lastOrderDate: new Date("2025-05-30") },
      { name: "Ian", email: "ian@example.com", totalSpend: 400, visits: 1, lastOrderDate: new Date("2024-11-10") },
      { name: "Jack", email: "jack@example.com", totalSpend: 9500, visits: 18, lastOrderDate: new Date("2025-09-05") },
      { name: "Karen", email: "karen@example.com", totalSpend: 6000, visits: 12, lastOrderDate: new Date("2025-08-20") },
      { name: "Leo", email: "leo@example.com", totalSpend: 300, visits: 2, lastOrderDate: new Date("2024-10-15") },
      { name: "Mia", email: "mia@example.com", totalSpend: 11000, visits: 25, lastOrderDate: new Date("2025-09-10") },
      { name: "Nina", email: "nina@example.com", totalSpend: 150, visits: 1, lastOrderDate: new Date("2024-07-01") },
      { name: "Oscar", email: "oscar@example.com", totalSpend: 5000, visits: 14, lastOrderDate: new Date("2025-06-18") },
      { name: "Paul", email: "paul@example.com", totalSpend: 2300, visits: 9, lastOrderDate: new Date("2025-03-25") },
      { name: "Quinn", email: "quinn@example.com", totalSpend: 4200, visits: 11, lastOrderDate: new Date("2025-08-12") },
      { name: "Rita", email: "rita@example.com", totalSpend: 780, visits: 4, lastOrderDate: new Date("2024-09-15") },
      { name: "Sam", email: "sam@example.com", totalSpend: 6700, visits: 16, lastOrderDate: new Date("2025-07-22") },
      { name: "Tina", email: "tina@example.com", totalSpend: 890, visits: 3, lastOrderDate: new Date("2024-12-05") },
    ]);

    console.log("✅ Seeded 20 sample customers");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding customers:", err);
    process.exit(1);
  }
}

seed();

