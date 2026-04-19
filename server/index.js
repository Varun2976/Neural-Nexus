import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authDB, deepfakeDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    /^chrome-extension:\/\//
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// MongoDB connections
authDB.on('connected', () => console.log('Auth DB connected'));
authDB.on('error', (err) => console.error('Auth DB error:', err));

deepfakeDB.on('connected', () => console.log('Deepfake DB connected'));
deepfakeDB.on('error', (err) => console.error('Deepfake DB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
