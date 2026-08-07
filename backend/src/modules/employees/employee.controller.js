const { createEmployee } = require('./employee.service');
const { success } = require('../../utils/response.util');
const AppError = require('../../utils/app-error');

async function create(req, res, next) {
  try {
    const required = ['employeeNumber', 'firstName', 'lastName', 'workEmail'];
    const missing = required.filter((field) => !req.body[field]?.trim());
    if (missing.length) throw new AppError(400, `Missing fields: ${missing.join(', ')}`);
    if (!/^\S+@\S+\.\S+$/.test(req.body.workEmail)) throw new AppError(400, 'Invalid work email');
    if (req.body.role && !['employee', 'manager'].includes(req.body.role)) {
      throw new AppError(400, 'HR can only create employee or manager accounts');
    }

    const result = await createEmployee(req.body);
    return success(res, 201, 'Employee created and activation email sent', {
      employee: result.employee,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
