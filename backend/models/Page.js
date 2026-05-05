const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title: { type: String, default: 'Untitled Page' },
  date: { type: String, default: '' },
  content: { type: String, default: '' },
  fontColor: { type: String, default: '#111111' },
  isBookmarked: { type: Boolean, default: false },
  lastSavedAt: { type: Date, default: Date.now }
});

// Update lastSavedAt on every save
pageSchema.pre('save', function(next) {
  this.lastSavedAt = Date.now();
  next();
});

module.exports = mongoose.model('Page', pageSchema);
