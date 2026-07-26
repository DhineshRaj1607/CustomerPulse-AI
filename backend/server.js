const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log('Loaded env: DATABASE_URL=', process.env.DATABASE_URL ? '[present]' : '[missing]');

const { connectDB } = require('./config/db');

const customerRoutes = require('./routes/customerRoutes');
const segmentRoutes = require('./routes/segmentRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

process.on('uncaughtException', (error) => {
  console.error('uncaughtException:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('exit', (code) => {
  console.log('Process exit event with code:', code);
});

const startServer = async () => {
  console.log('Starting backend server...');
  await connectDB();

  console.log('Database connected, registering routes...');
  app.use('/api/customers', customerRoutes);
  app.use('/api/segments', segmentRoutes);
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.get('/', (req, res) => {
    res.json({ message: 'CustomerPulse AI CRM API Running' });
  });

  const port = process.env.PORT || 5000;

  const server = app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
};

startServer();