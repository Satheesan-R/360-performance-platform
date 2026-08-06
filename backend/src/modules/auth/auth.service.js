const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Employee = require('../../models/employee');
const AccountActivation = require('../../models/account-activation');
const AppError = require('../../utils/app-error');
const { env } = require('../../config/env');
const {
  generateOtp,
  hashValue,
  signAccessToken,
  signSetupToken,
  verifyToken,
} = require('../../utils/token.utils');
const { sendOtpEmail } = require('../../services/email.service');

async function findActivation(rawToken, includeOtp = false) {
  const query = AccountActivation.findOne({
    activationTokenHash: hashValue(rawToken),
    activationExpiresAt: { $gt: new Date() },
    usedAt: null,
  }).populate('user');
  if (includeOtp) query.select('+otpHash');
  const activation = await query;
  if (!activation || !activation.user) throw new AppError(400, 'Activation link is invalid or expired');
  return activation;
}

async function activationDetails(rawToken) {
  const activation = await findActivation(rawToken);
  const employee = await Employee.findById(activation.user.employee);
  return {
    email: activation.user.email.replace(/(^.).*(@.*$)/, '$1***$2'),
    firstName: employee?.firstName,
    otpVerified: Boolean(activation.otpVerifiedAt),
  };
}

async function sendOtp(rawToken) {
  const activation = await findActivation(rawToken, true);
  const employee = await Employee.findById(activation.user.employee);
  if (!employee) throw new AppError(404, 'Employee record not found');
  if (activation.lastOtpSentAt && Date.now() - activation.lastOtpSentAt.getTime() < 60_000) {
    throw new AppError(429, 'Wait 60 seconds before requesting another OTP');
  }

  const otp = generateOtp();
  activation.otpHash = await bcrypt.hash(otp, 10);
  activation.otpExpiresAt = new Date(Date.now() + env.otpMinutes * 60 * 1000);
  activation.otpAttempts = 0;
  activation.lastOtpSentAt = new Date();
  activation.otpVerifiedAt = undefined;
  await activation.save();
  await sendOtpEmail({ employee, otp, minutes: env.otpMinutes });

  return { expiresInMinutes: env.otpMinutes, developmentOtp: env.nodeEnv === 'production' ? undefined : otp };
}

async function verifyOtp(rawToken, otp) {
  const activation = await findActivation(rawToken, true);
  if (!activation.otpHash || !activation.otpExpiresAt) throw new AppError(400, 'Request an OTP first');
  if (activation.otpExpiresAt <= new Date()) throw new AppError(400, 'OTP has expired');
  if (activation.otpAttempts >= 5) throw new AppError(429, 'Too many incorrect attempts; request a new OTP');

  const matches = await bcrypt.compare(otp, activation.otpHash);
  if (!matches) {
    activation.otpAttempts += 1;
    await activation.save();
    throw new AppError(400, 'Incorrect OTP');
  }

  activation.otpVerifiedAt = new Date();
  activation.otpHash = undefined;
  activation.otpExpiresAt = undefined;
  await activation.save();
  activation.user.status = 'otp_verified';
  await activation.user.save();

  return { setupToken: signSetupToken(activation.user.id, activation.id) };
}

async function setPassword(rawToken, setupToken, password) {
  let payload;
  try {
    payload = verifyToken(setupToken);
  } catch {
    throw new AppError(401, 'Password setup session is invalid or expired');
  }
  if (payload.purpose !== 'password-setup') throw new AppError(401, 'Invalid password setup token');

  const activation = await findActivation(rawToken);
  if (
    activation.id !== payload.activationId ||
    activation.user.id !== payload.sub ||
    !activation.otpVerifiedAt ||
    activation.user.status !== 'otp_verified'
  ) {
    throw new AppError(401, 'OTP verification is required');
  }

  activation.user.passwordHash = await bcrypt.hash(password, 12);
  activation.user.status = 'active';
  await activation.user.save();
  activation.usedAt = new Date();
  await activation.save();
}

async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'Invalid email or password');
  }
  if (user.status !== 'active') throw new AppError(403, 'Account is not active');

  user.lastLoginAt = new Date();
  await user.save();
  return {
    token: signAccessToken(user),
    user: { id: user.id, email: user.email, role: user.role },
  };
}

module.exports = { activationDetails, sendOtp, verifyOtp, setPassword, login };
