const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contractRoutes = require('./routes/contractRoutes');
const referenceRoutes = require('./routes/referenceRoutes');
const authRoutes = require('./routes/authRoutes');
const { ALERT_WINDOW_DAYS } = require('./services/contractLifecycle');
const { startRenewalMonitor } = require('./services/renewalService');
const { ensureSeedData } = require('./services/seedService');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const renewalIntervalMs = Number(process.env.RENEWAL_CHECK_INTERVAL_MS) || 3600000;
const renewalDaysThreshold = Number(process.env.RENEWAL_ALERT_DAYS) || ALERT_WINDOW_DAYS;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      // Remove X-Frame-Options and CSP to allow the frontend iframe (on a different port) to embed it
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
    }
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api', referenceRoutes);

// Frontend is hosted separately (Vercel); return 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Unhandled server error' });
});

async function startServer() {
  await connectDB(process.env.MONGODB_URI);
  await ensureSeedData();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  startRenewalMonitor({
    intervalMs: renewalIntervalMs,
    daysThreshold: renewalDaysThreshold,
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
