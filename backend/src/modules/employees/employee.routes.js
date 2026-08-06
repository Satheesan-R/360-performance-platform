const router = require('express').Router();
const controller = require('./employee.controller');
const { authenticate, authorize } = require('../../middleware/middleware');

router.post('/', authenticate, authorize('hr', 'admin'), controller.create);

module.exports = router;
