require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' })); // Limit body size

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/pages', pageRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(errorHandler);

// Export the Express API
module.exports = app;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Only listen on a port if not running in Vercel serverless environment
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
