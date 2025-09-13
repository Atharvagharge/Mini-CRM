const mongoose = require("mongoose");
const Customer = require("./src/models/Customer");

function getType(val) {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mini-crm");
    const docs = await Customer.find({});
    console.log(`\n📊 Found ${docs.length} customers in DB:\n`);
    
    docs.forEach((c, idx) => {
      console.log(`--- Customer ${idx + 1} ---`);
      console.log(`Name: ${c.name} (${getType(c.name)})`);
      console.log(`Email: ${c.email} (${getType(c.email)})`);
      console.log(`Phone: ${c.phone} (${getType(c.phone)})`);
      console.log(`Total Spend: ${c.totalSpend} (${getType(c.totalSpend)})`);
      console.log(`Visits: ${c.visits} (${getType(c.visits)})`);
      console.log(`Last Order Date: ${c.lastOrderDate} (${getType(c.lastOrderDate)})`);
      console.log();
    });
  } catch (err) {
    console.error("❌ Error checking customers:", err.message);
  } finally {
    process.exit();
  }
}

run();
