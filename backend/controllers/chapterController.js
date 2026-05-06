const Chapter = require('../models/Chapter');
const Book = require('../models/Book');

exports.createChapter = async (req, res, next) => {
  try {
    const { title, bookId, order } = req.body;
    const chapter = new Chapter({ title, bookId, order });
    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    next(err);
  }
};

exports.getChaptersByBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Allow if public or if it belongs to the logged-in user
    if (book.isPublic || (req.user && book.userId.toString() === req.user.toString())) {
      const chapters = await Chapter.find({ bookId: req.params.bookId }).sort('order');
      res.json(chapters);
    } else {
      res.status(403).json({ message: 'Not authorized to view these chapters' });
    }
  } catch (err) {
    next(err);
  }
};
