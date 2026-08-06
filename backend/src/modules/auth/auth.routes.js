const router = require('express').Router();
const controller = require('./auth.controller');
const { authenticate } = require('../../middleware/middleware');

router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.get('/activation/:token', controller.details);
router.post('/activation/:token/send-otp', controller.sendOtp);
router.post('/activation/:token/verify-otp', controller.verifyOtp);
router.post('/activation/:token/set-password', controller.setPassword);

module.exports = router;
