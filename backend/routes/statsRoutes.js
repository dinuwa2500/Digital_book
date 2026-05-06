const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Track and get unique visitor count
router.get('/track', async (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // If there's a comma-separated list (common in Vercel/proxies), take the first IP
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    
    // Check if visitor already exists
    let visitor = await Visitor.findOne({ ip });
    
    if (!visitor) {
      visitor = new Visitor({
        ip,
        userAgent: req.headers['user-agent']
      });
      await visitor.save();
    } else {
      visitor.lastVisit = Date.now();
      await visitor.save();
    }

    const count = await Visitor.countDocuments();
    res.json({ uniqueVisitors: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Just get the count
router.get('/count', async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.json({ uniqueVisitors: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
