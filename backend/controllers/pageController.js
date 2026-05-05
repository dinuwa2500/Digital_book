const Page = require('../models/Page');

exports.createPage = async (req, res, next) => {
  try {
    const { chapterId, title } = req.body;
    const page = new Page({ chapterId, title });
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
};

exports.getPagesByChapter = async (req, res, next) => {
  try {
    const pages = await Page.find({ chapterId: req.params.chapterId });
    res.json(pages);
  } catch (err) {
    next(err);
  }
};

exports.savePageContent = async (req, res, next) => {
  try {
    const { content, date, fontColor } = req.body;
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { content, date, fontColor },
      { new: true }
    );
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    next(err);
  }
};

exports.getPageById = async (req, res, next) => {
    try {
      const page = await Page.findById(req.params.id);
      if (!page) return res.status(404).json({ message: 'Page not found' });
      res.json(page);
    } catch (err) {
      next(err);
    }
  };

exports.toggleBookmark = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    page.isBookmarked = !page.isBookmarked;
    await page.save();
    res.json(page);
  } catch (err) {
    next(err);
  }
};
