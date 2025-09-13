const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: String,
  segment: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment' },
  messageTemplate: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  audienceSize: Number,
  stats: {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
