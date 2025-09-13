const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  totalSpend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastOrderDate: Date,
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Customer', CustomerSchema);
