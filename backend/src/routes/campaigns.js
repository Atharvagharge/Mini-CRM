const express = require('express');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const { suggestMessages } = require('../utils/ai');

const router = express.Router();

/**
 * GET /api/campaigns
 * list campaigns for user, latest first
 */
router.get('/', async (req, res) => {
  const campaigns = await Campaign.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  // fetch basic stats
  const enriched = await Promise.all(campaigns.map(async (c) => {
    const sent = await CommunicationLog.countDocuments({ campaign: c._id, status: 'SENT' });
    const failed = await CommunicationLog.countDocuments({ campaign: c._id, status: 'FAILED' });
    return { ...c.toObject(), stats: { sent, failed } };
  }));
  res.json({ campaigns: enriched });
});

/**
 * POST /api/campaigns/suggest-messages
 * body: { objective, audienceSummary? }
 * calls AI
 */
router.post('/suggest-messages', async (req, res) => {
  try {
    const { objective, audienceSummary } = req.body;
    const arr = await suggestMessages(objective, audienceSummary || '');
    res.json({ suggestions: arr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
