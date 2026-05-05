const Chapter = require('../models/Chapter');

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
    const chapters = await Chapter.find({ bookId: req.params.bookId }).sort('order');
    res.json(chapters);
  } catch (err) {
    next(err);
  }
};
