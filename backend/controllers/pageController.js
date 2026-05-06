const Page = require('../models/Page');
const Chapter = require('../models/Chapter');
const Book = require('../models/Book');

const checkBookAccess = async (chapterId, userId) => {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return false;
  const book = await Book.findById(chapter.bookId);
  if (!book) return false;
  return book.isPublic || (userId && book.userId.toString() === userId.toString());
};

const isBookOwner = async (chapterId, userId) => {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return false;
  const book = await Book.findById(chapter.bookId);
  if (!book) return false;
  return userId && book.userId.toString() === userId.toString();
};

exports.createPage = async (req, res, next) => {
  try {
    const { chapterId, title } = req.body;
    if (!(await isBookOwner(chapterId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to add pages to this book' });
    }
    const page = new Page({ chapterId, title });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
};

exports.getPagesByChapter = async (req, res, next) => {
  try {
    if (!(await checkBookAccess(req.params.chapterId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to view these pages' });
    }
    const pages = await Page.find({ chapterId: req.params.chapterId });
    res.json(pages);
  } catch (err) {
    next(err);
  }
};

exports.savePageContent = async (req, res, next) => {
  try {
    const { content, date, fontColor, images } = req.body;
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    if (!(await isBookOwner(page.chapterId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to edit this page' });
    }

    page.content = content;
    page.date = date;
    page.fontColor = fontColor;
    page.images = images;
    await page.save();
    res.json(page);
  } catch (err) {
    next(err);
  }
};

exports.getPageById = async (req, res, next) => {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) return res.status(404).json({ message: 'Page not found' });
      
      if (!(await checkBookAccess(page.chapterId, req.user))) {
        return res.status(403).json({ message: 'Not authorized to view this page' });
      }
      res.json(page);
    } catch (err) {
      next(err);
    }
  };

exports.toggleBookmark = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    if (!(await isBookOwner(page.chapterId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to bookmark this page' });
    }

    page.isBookmarked = !page.isBookmarked;
    await page.save();
    res.json(page);
  } catch (err) {
    next(err);
  }
};
