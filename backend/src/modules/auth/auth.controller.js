const authService = require('./auth.service');
const { success } = require('../../utils/response.util');
const AppError = require('../../utils/app-error');

function requireFields(body, fields) {
  const missing = fields.filter((field) => typeof body[field] !== 'string' || !body[field].trim());
  if (missing.length) throw new AppError(400, `Missing fields: ${missing.join(', ')}`);
}

async function details(req, res, next) {
  try {
    return success(res, 200, 'Activation link is valid', await authService.activationDetails(req.params.token));
  } catch (error) { next(error); }
}

async function sendOtp(req, res, next) {
  try {
    return success(res, 200, 'OTP sent to employee email', await authService.sendOtp(req.params.token));
  } catch (error) { next(error); }
}

async function verifyOtp(req, res, next) {
  try {
    requireFields(req.body, ['otp']);
    if (!/^\d{6}$/.test(req.body.otp)) throw new AppError(400, 'OTP must contain 6 digits');
    return success(res, 200, 'OTP verified', await authService.verifyOtp(req.params.token, req.body.otp));
  } catch (error) { next(error); }
}

async function setPassword(req, res, next) {
  try {
    requireFields(req.body, ['setupToken', 'password']);
    if (req.body.password.length < 8 || !/[A-Z]/.test(req.body.password) || !/[a-z]/.test(req.body.password) || !/\d/.test(req.body.password)) {
      throw new AppError(400, 'Password must be at least 8 characters and include uppercase, lowercase, and a number');
    }
    await authService.setPassword(req.params.token, req.body.setupToken, req.body.password);
    return success(res, 200, 'Account activated; you can now log in');
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    requireFields(req.body, ['email', 'password']);
    return success(res, 200, 'Login successful', await authService.login(req.body.email, req.body.password));
  } catch (error) { next(error); }
}

async function me(req, res, next) {
  try {
    return success(res, 200, 'Current user', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      employee: req.user.employee,
    });
  } catch (error) { next(error); }
}

module.exports = { details, sendOtp, verifyOtp, setPassword, login, me };
