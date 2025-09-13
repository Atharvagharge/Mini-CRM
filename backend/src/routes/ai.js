const express = require("express");
const router = express.Router();

// Simulated AI message suggestion
router.post("/suggest-messages", async (req, res) => {
  try {
    const { objective } = req.body;

    // Simple fake suggestions (you can replace with GPT call later)
    const suggestions = [
      `Hi {name}, we miss you! Come back and enjoy 20% off your next order.`,
      `Hey {name}, it's been a while! Here's a ₹500 voucher just for you.`,
      `Hello {name}, your loyalty means a lot. Enjoy free shipping on your next order!`,
      `Hi {name}, since your last spend of ₹{spend}, we thought you'd love this special deal.`,
    ];

    // Randomly pick 3
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    res.json({ suggestions: shuffled.slice(0, 3), objective });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
