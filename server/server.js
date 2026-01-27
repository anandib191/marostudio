import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import pricePlansRoutes from './routes/pricePlans.js';
import creditsRoutes from './routes/credits.js';
import statisticsRoutes from './routes/statistics.js';
import { validateEnv } from './utils/validateEnv.js';
import logger from './utils/logger.js';
import { generalLimiter, authLimiter, otpLimiter, creditsLimiter, adminGetLimiter } from './middleware/rateLimiter.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in server directory
dotenv.config({ path: join(__dirname, '.env') });

// Check if running on Vercel (serverless)
const isVercel = process.env.VERCEL === '1';

// Validate environment variables
// Only validate if not on Vercel (Vercel has its own env management)
if (!isVercel) {
  validateEnv();
}

// MongoDB connection - lazy load for serverless
let dbConnected = false;
const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }
};

const app = express();

// Middleware - CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Security Headers - Permissions Policy
app.use((req, res, next) => {
  // Set Permissions Policy to block device motion/orientation (for privacy)
  // If you need these features, change '()' to '(self)' or specific origins
  res.setHeader('Permissions-Policy', 
    'accelerometer=(), ' +
    'ambient-light-sensor=(), ' +
    'autoplay=(), ' +
    'camera=(), ' +
    'cross-origin-isolated=(), ' +
    'display-capture=(), ' +
    'document-domain=(), ' +
    'encrypted-media=(), ' +
    'execution-while-not-rendered=(), ' +
    'execution-while-out-of-viewport=(), ' +
    'fullscreen=(self), ' +
    'geolocation=(), ' +
    'gyroscope=(), ' +
    'magnetometer=(), ' +
    'microphone=(), ' +
    'midi=(), ' +
    'navigation-override=(), ' +
    'payment=(self), ' +
    'picture-in-picture=(self), ' +
    'publickey-credentials-get=(), ' +
    'screen-wake-lock=(), ' +
    'sync-xhr=(), ' +
    'usb=(), ' +
    'web-share=(), ' +
    'xr-spatial-tracking=()'
  );
  next();
});

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route - should be accessible without DB connection
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Favicon handler - return 204 No Content to avoid 404 in logs
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Apply rate limiting (only if not on Vercel, as Vercel has its own rate limiting)
if (!isVercel) {
  // Credits routes need higher limit due to frequent polling
  // Apply credits limiter specifically to credits routes
  app.use('/api/credits', creditsLimiter);
  
  // Apply general limiter to all routes EXCEPT credits, admin, and auth
  // Admin routes completely bypass rate limiting (real-world solution)
  app.use((req, res, next) => {
    // Skip general limiter for credits routes (they have their own)
    if (req.path.startsWith('/api/credits')) {
      return next();
    }
    // Skip general limiter for admin routes (NO rate limiting for admin)
    if (req.path.startsWith('/api/admin')) {
      return next();
    }
    // Skip general limiter for auth routes (they have their own limiter)
    if (req.path.startsWith('/api/auth')) {
      return next();
    }
    // Apply general limiter to all other routes (authenticated users skip automatically)
    return generalLimiter(req, res, next);
  });
}

// Middleware to ensure DB connection before handling API requests
// Skip DB check for health endpoint
app.use(async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/health' || req.path === '/') {
    return next();
  }
  
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

// Routes (Bladdit image gen is called directly from frontend → https://api.bladdit.com/v1/generate, no backend proxy)
// Apply authLimiter to auth routes (OTP has its own limiter within the route)
if (!isVercel) {
  app.use('/api/auth', authLimiter);
}
app.use('/api/auth', authRoutes);
// Admin routes: NO rate limiting at all (admin users can work freely)
// Rate limiting is handled inside admin routes middleware (protect + admin)
// Admin users skip rate limiting completely in rateLimiter middleware
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/price-plans', pricePlansRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/statistics', statisticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NextGenPhoto API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      admin: '/api/admin',
      payment: '/api/payment',
      pricePlans: '/api/price-plans',
      credits: '/api/credits',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err, {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Only start server if not on Vercel (Vercel handles this)
if (!isVercel) {
  // Graceful shutdown handler
  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });

  const PORT = process.env.PORT || 8000;

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export app for Vercel serverless functions
export default app;
