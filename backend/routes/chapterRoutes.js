const express = require('express');
const router = express.Router();
const { createChapter, getChaptersByBook } = require('../controllers/chapterController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createChapter);
router.get('/book/:bookId', getChaptersByBook);

module.exports = router;
