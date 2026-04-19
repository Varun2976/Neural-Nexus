import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { authDB, deepfakeDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { setActiveClients } from './utils/broadcast.js';

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const activeClients = new Set();
setActiveClients(activeClients);

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

// WebSocket authentication and connection handling
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    ws.close(4001, 'Missing token');
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    activeClients.add(ws);
    console.log(`Client connected. Active clients: ${activeClients.size}`);

    ws.on('close', () => {
      activeClients.delete(ws);
      console.log(`Client disconnected. Active clients: ${activeClients.size}`);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  } catch (error) {
    ws.close(4002, 'Invalid token');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
