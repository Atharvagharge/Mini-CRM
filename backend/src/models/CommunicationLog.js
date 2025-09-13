const mongoose = require('mongoose');

const CommLog = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  customerEmail: String,
  personalizedMessage: String,
  status: { type: String, enum: ['PENDING','SENT','FAILED'], default: 'PENDING' },
  vendorMessageId: String,
  createdAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunicationLog', CommLog);
