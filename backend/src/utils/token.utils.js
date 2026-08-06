const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function randomToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashValue(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, purpose: 'access' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

function signSetupToken(userId, activationId) {
  return jwt.sign(
    { sub: userId.toString(), activationId: activationId.toString(), purpose: 'password-setup' },
    env.jwtSecret,
    { expiresIn: `${env.setupTokenMinutes}m` }
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = {
  randomToken,
  generateOtp,
  hashValue,
  signAccessToken,
  signSetupToken,
  verifyToken,
};
