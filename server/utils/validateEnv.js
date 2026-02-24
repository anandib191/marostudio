/**
 * Environment variable validation
 * Ensures all required environment variables are set before server starts
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
];

const optionalEnvVars = {
  PORT: '8000',
  NODE_ENV: 'development',
  FRONTEND_URL: 'http://localhost:3000',
  JWT_EXPIRE: '30m',
  ADMIN_EMAILS: '',
};

export const validateEnv = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables and set defaults
  Object.entries(optionalEnvVars).forEach(([varName, defaultValue]) => {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue;
      if (process.env.NODE_ENV === 'production') {
        warnings.push(`${varName} not set, using default: ${defaultValue}`);
      }
    }
  });

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file.\n');
    // Don't exit in Vercel serverless environment
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('\n⚠️  Environment variable warnings:');
    warnings.forEach((warning) => {
      console.warn(`   - ${warning}`);
    });
    console.warn('');
  }

  // Validate JWT_SECRET strength in production
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for production!');
    }
  }

  // Validate MongoDB URI format
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.error('❌ Invalid MONGODB_URI format. Must start with "mongodb://" or "mongodb+srv://"');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};
