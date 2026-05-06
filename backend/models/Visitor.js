const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  userAgent: String,
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
