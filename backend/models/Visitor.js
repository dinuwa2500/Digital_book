const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  userAgent: String,
  country: { type: String, default: 'Unknown' },
  countryCode: { type: String, default: '??' },
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
