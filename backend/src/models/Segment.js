const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
  name: String,
  rules: mongoose.Schema.Types.Mixed, // rule tree JSON
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Segment', SegmentSchema);
