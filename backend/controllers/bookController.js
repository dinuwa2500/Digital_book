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
