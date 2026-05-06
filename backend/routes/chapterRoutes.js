const express = require('express');
const router = express.Router();
const { createChapter, getChaptersByBook } = require('../controllers/chapterController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/', auth, createChapter);
router.get('/book/:bookId', optionalAuth, getChaptersByBook);

module.exports = router;
