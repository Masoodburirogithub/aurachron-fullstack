// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const { initializeSocket } = require('./src/sockets/socketManager');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// IMPORTANT: Serve static files from uploads directory
// This makes images accessible at http://localhost:5000/uploads/...
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/case-studies', express.static(path.join(__dirname, 'uploads/case-studies')));

// Log uploads path for debugging
console.log('Uploads directory:', path.join(__dirname, 'uploads'));
console.log('Static files served from: /uploads');

// Make io accessible to routes
app.set('io', io);

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const careerRoutes = require('./src/routes/careerRoutes');
const caseStudyRoutes = require('./src/routes/caseStudyRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads`);
});