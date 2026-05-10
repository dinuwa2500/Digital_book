const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const http = require('http');

// Helper to fetch JSON from URL
const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
};

// Track and get unique visitor count
router.get('/track', async (req, res) => {
  try {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // If there's a comma-separated list (common in Vercel/proxies), take the first IP
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    // Filter out localhost IPs for geolocation
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
    
    // Check if visitor already exists
    let visitor = await Visitor.findOne({ ip });
    
    if (!visitor) {
      let country = 'Unknown';
      let countryCode = '??';

      // Only fetch geolocation if not local
      if (!isLocal) {
        try {
          // Use http for ip-api.com free tier
          const geoData = await getJSON(`http://ip-api.com/json/${ip}`);
          if (geoData.status === 'success') {
            country = geoData.country;
            countryCode = geoData.countryCode;
          }
        } catch (geoErr) {
          console.error('Geo tracking failed:', geoErr.message);
        }
      } else {
        country = 'Localhost';
        countryCode = 'LH';
      }

      visitor = new Visitor({
        ip,
        userAgent: req.headers['user-agent'],
        country,
        countryCode
      });
      await visitor.save();
    } else {
      visitor.lastVisit = Date.now();
      await visitor.save();
    }

    const count = await Visitor.countDocuments();
    res.json({ uniqueVisitors: count });
  } catch (err) {
    console.error('Track error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get unique visitor count
router.get('/count', async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.json({ uniqueVisitors: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get breakdown by country
router.get('/countries', async (req, res) => {
  try {
    const breakdown = await Visitor.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
          code: { $first: "$countryCode" }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(breakdown);
  } catch (err) {
    console.error('Countries breakdown error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
