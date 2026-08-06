const AppError = require('../utils/app-error');
const User = require('../models/user');
const { verifyToken } = require('../utils/token.utils');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }

    const payload = verifyToken(header.slice(7));
    if (payload.purpose !== 'access') throw new AppError(401, 'Invalid access token');

    const user = await User.findById(payload.sub);
    if (!user || user.status !== 'active') throw new AppError(401, 'Account is not active');

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Invalid or expired access token'));
    }
    next(error);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'You do not have permission for this action'));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
