const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBookById, togglePublic } = require('../controllers/bookController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/', auth, createBook);
router.get('/', auth, getBooks);
router.get('/:id', optionalAuth, getBookById);
router.patch('/:id/public', auth, togglePublic);

module.exports = router;
