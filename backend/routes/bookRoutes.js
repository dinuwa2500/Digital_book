const express = require('express');
const router = express.Router();
const { createBook, getBooks } = require('../controllers/bookController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createBook);
router.get('/', getBooks);

module.exports = router;
