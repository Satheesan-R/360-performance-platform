const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['MONGODB_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  if (!['console', 'smtp'].includes(process.env.MAIL_MODE || 'console')) {
    throw new Error('MAIL_MODE must be console or smtp');
  }
}

module.exports = {
  validateEnv,
  env: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    mailMode: process.env.MAIL_MODE || 'console',
    mailHost: process.env.MAIL_HOST || 'smtp.gmail.com',
    mailPort: Number(process.env.MAIL_PORT) || 465,
    mailSecure: process.env.MAIL_SECURE !== 'false',
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailFrom: process.env.MAIL_FROM,
    activationTokenMinutes: Number(process.env.ACTIVATION_TOKEN_MINUTES) || 1440,
    otpMinutes: Number(process.env.OTP_MINUTES) || 10,
    setupTokenMinutes: Number(process.env.SETUP_TOKEN_MINUTES) || 10,
  },
};
