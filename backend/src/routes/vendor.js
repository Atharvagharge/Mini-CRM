const express = require('express');
const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');
const axios = require('axios');

const router = express.Router();
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

// Simulated vendor send endpoint
/**
 * POST /vendor/send
 * body: { to, message, localMessageId }
 * Simulates network delay and sends a receipt back to /vendor/receipt (internal call)
 */
router.post('/send', async (req, res) => {
  try {
    const { to, message, localMessageId } = req.body;
    // simulate asynchronous behavior
    setTimeout(async () => {
      // random success ~90%
      const rand = Math.random();
      const status = rand < 0.9 ? 'SENT' : 'FAILED';
      // vendorMessageId (simulated)
      const vendorMessageId = 'ven-' + Math.random().toString(36).slice(2,10);

      // call delivery receipt (POST)
      try {
        await axios.post(`${BACKEND}/vendor/receipt`, {
          localMessageId,
          status,
          vendorMessageId,
          to
        });
      } catch (e) {
        console.error('vendor could not post receipt', e.message);
      }
    }, 500 + Math.floor(Math.random() * 1500));

    // immediate ack
    res.json({ ok: true, queued: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/**
 * POST /vendor/receipt
 * body: { localMessageId, status, vendorMessageId, to }
 * Updates communication log & campaign stats
 */
router.post('/receipt', async (req, res) => {
  try {
    const { localMessageId, status, vendorMessageId } = req.body;
    const log = await CommunicationLog.findById(localMessageId);
    if (!log) return res.status(404).json({ error: 'log not found' });

    log.status = status;
    log.vendorMessageId = vendorMessageId;
    log.lastUpdatedAt = new Date();
    await log.save();

    // update campaign stats (simple)
    const campaign = await Campaign.findById(log.campaign);
    if (campaign) {
      if (status === 'SENT') campaign.stats.sent = (campaign.stats.sent || 0) + 1;
      if (status === 'FAILED') campaign.stats.failed = (campaign.stats.failed || 0) + 1;
      await campaign.save();
    }

    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
