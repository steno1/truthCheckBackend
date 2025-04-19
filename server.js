import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';

import checkRoutes from './routes/checkRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import languageRoutes from './routes/languageRoutes.js';

dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors({
  origin: '*'  // Allow all origins, modify as necessary for security in production
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Log incoming requests (for development)
app.use(morgan('dev'));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/check/text', checkRoutes);  // The check route for verifying claims
app.use('/api/report', reportRoutes);
app.use('/api/languages', languageRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);  // Exit the process with an error code
  });
