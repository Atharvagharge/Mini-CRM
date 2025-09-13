const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  customerEmail: String,
  amount: Number,
  date: Date,
  items: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Order', OrderSchema);
