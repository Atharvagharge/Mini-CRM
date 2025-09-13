const express = require('express');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

const router = express.Router();

/**
 * @route POST /api/ingest/customers
 * body: { customers: [ {name, email, phone, totalSpend, visits, lastOrderDate} ] }
 */
router.post('/customers', async (req, res) => {
  try {
    const { customers } = req.body;
    if (!Array.isArray(customers)) return res.status(400).json({ error: 'customers must be array' });
    const ops = customers.map(c => ({
      updateOne: {
        filter: { email: c.email },
        update: { $set: c },
        upsert: true
      }
    }));
    await Customer.bulkWrite(ops);
    res.json({ ok: true, inserted: customers.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/**
 * @route POST /api/ingest/orders
 * body: { orders: [ { orderId, customerEmail, amount, date, items } ] }
 */
router.post('/orders', async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) return res.status(400).json({ error: 'orders must be array' });
    await Order.insertMany(orders);
    // update customer aggregates (simple sample)
    for (const o of orders) {
      await Customer.findOneAndUpdate({ email: o.customerEmail }, {
        $inc: { totalSpend: o.amount, visits: 1 },
        $set: { lastOrderDate: o.date }
      }, { upsert: true });
    }
    res.json({ ok: true, inserted: orders.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
