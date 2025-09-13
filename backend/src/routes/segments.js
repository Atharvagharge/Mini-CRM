const express = require('express');
const Segment = require('../models/Segment');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const { buildMongoQuery } = require('../utils/ruleEngine');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * POST /api/segments/preview
 * body: { rules }
 * returns count and sample
 */
router.post('/preview', async (req, res) => {
    try {
      const { rules } = req.body;
      console.log("📥 Incoming rules:", JSON.stringify(rules, null, 2));
  
      const mongoQ = buildMongoQuery(rules);
      console.log("🛠 Built query:", JSON.stringify(mongoQ, null, 2));
  
      const count = await Customer.countDocuments(mongoQ);
      const sample = await Customer.find(mongoQ).limit(10);
  
      console.log("📊 Preview count:", count);
      console.log("📊 Sample:", sample);
  
      res.json({ count, sample });
    } catch (err) { 
      console.error("❌ Preview error:", err);
      res.status(500).json({ error: err.message }); 
    }
  });
  

/**
 * POST /api/segments
 * body: { name, rules, messageTemplate }
 * creates segment, campaign, logs, and initiates delivery (synchronously or asynchronously)
 */
router.post('/', async (req, res) => {
  try {
    const { name, rules, messageTemplate } = req.body;
    const createdBy = req.user._id;
    const segment = await Segment.create({ name, rules, createdBy });
    // find audience
    const mongoQ = buildMongoQuery(rules);
    const audience = await Customer.find(mongoQ);
    const audienceSize = audience.length;

    const campaign = await Campaign.create({
      name,
      segment: segment._id,
      messageTemplate,
      createdBy,
      audienceSize,
      stats: { sent: 0, failed: 0 }
    });

    // create communication logs & call vendor simulator per customer
    for (const cust of audience) {
      const personalized = personalizeMessage(messageTemplate, cust);
      const log = await CommunicationLog.create({
        campaign: campaign._id,
        customerEmail: cust.email,
        personalizedMessage: personalized,
        status: 'PENDING'
      });

      // call vendor simulator endpoint
      // pass local message id so receipt can update correct log
      axios.post(`${BACKEND}/vendor/send`, {
        to: cust.email,
        message: personalized,
        localMessageId: log._id.toString()
      }).catch(e => console.warn('vendor send error', e.message));
    }

    res.json({ ok: true, segment, campaign, audienceSize });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function personalizeMessage(template, cust) {
  if (!template) return `Hi ${cust.name || cust.email}`;
  return template
    .replace(/\{name\}/gi, cust.name || cust.email)
    .replace(/\{email\}/gi, cust.email)
    .replace(/\{spend\}/gi, cust.totalSpend != null ? cust.totalSpend : '')
    ;
}

module.exports = router;
