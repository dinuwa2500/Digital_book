const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chapter', chapterSchema);
