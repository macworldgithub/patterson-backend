require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Patterson Cheney CRM API running' }));

// Routes
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/calls', require('./routes/calls'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/users'));   // auth endpoints share user router
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/audit-logs', require('./routes/auditLogs'));
app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/simulation', require('./routes/simulation'));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;