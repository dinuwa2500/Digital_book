const express = require('express');
const router = express.Router();
const { createPage, getPagesByChapter, savePageContent, getPageById, toggleBookmark } = require('../controllers/pageController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createPage);
router.get('/chapter/:chapterId', getPagesByChapter);
router.get('/:id', getPageById);
router.patch('/:id', savePageContent);
router.patch('/:id/bookmark', toggleBookmark);

module.exports = router;
