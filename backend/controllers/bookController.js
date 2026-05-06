const Book = require('../models/Book');

exports.createBook = async (req, res, next) => {
  try {
    const { title } = req.body;
    const book = new Book({ title, userId: req.user });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ userId: req.user });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Allow if public or if it belongs to the logged-in user
    if (book.isPublic || (req.user && book.userId.toString() === req.user.toString())) {
      res.json(book);
    } else {
      res.status(403).json({ message: 'Not authorized to view this book' });
    }
  } catch (err) {
    next(err);
  }
};

exports.togglePublic = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    book.isPublic = !book.isPublic;
    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
};
