const express = require('express');
const router = express.Router();
const { createPage, getPagesByChapter, savePageContent, getPageById, toggleBookmark } = require('../controllers/pageController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/', auth, createPage);
router.get('/chapter/:chapterId', optionalAuth, getPagesByChapter);
router.get('/:id', optionalAuth, getPageById);
router.patch('/:id', auth, savePageContent);
router.patch('/:id/bookmark', auth, toggleBookmark);

module.exports = router;
