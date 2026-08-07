const User = require('../../models/user');
const Employee = require('../../models/employee');
const AccountActivation = require('../../models/account-activation');
const AppError = require('../../utils/app-error');
const { env } = require('../../config/env');
const { randomToken, hashValue } = require('../../utils/token.utils');
const { sendActivationEmail } = require('../../services/email.service');

async function createEmployee(input) {
  const email = input.workEmail.toLowerCase().trim();
  const personalEmail = input.personalEmail?.toLowerCase().trim() || undefined;
  const employeeData = {
    employeeNumber: input.employeeNumber.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    workEmail: email,
    personalEmail,
    phone: input.phone?.trim() || undefined,
    address: input.address?.trim() || undefined,
    university: input.university?.trim() || undefined,
    previousCompany: input.previousCompany?.trim() || undefined,
    previousJobTitle: input.previousJobTitle?.trim() || undefined,
    yearsOfExperience: input.yearsOfExperience?.trim() || undefined,
    jobTitle: input.jobTitle?.trim() || undefined,
    department: input.department?.trim() || undefined,
    JoiningDate: input.JoiningDate || undefined,
    probationPeriod: input.probationPeriod?.trim() || undefined,
    manager: input.manager?.trim() || undefined,
  };
  const duplicate = await Employee.exists({
    $or: [{ workEmail: email }, { employeeNumber: employeeData.employeeNumber }],
  });
  if (duplicate || (await User.exists({ email }))) {
    throw new AppError(409, 'Employee number or email already exists');
  }

  let employee;
  let user;
  let activation;
  try {
    employee = await Employee.create(employeeData);
    user = await User.create({ employee: employee.id, email, role: input.role || 'employee' });
    employee.user = user.id;
    await employee.save();

    const rawToken = randomToken();
    const expiresAt = new Date(Date.now() + env.activationTokenMinutes * 60 * 1000);
    activation = await AccountActivation.create({
      user: user.id,
      activationTokenHash: hashValue(rawToken),
      activationExpiresAt: expiresAt,
    });

    const activationUrl = `${env.frontendUrl}/auth/activate?token=${rawToken}`;
    await sendActivationEmail({ employee, activationUrl });

    return { employee };
  } catch (error) {
    if (activation) await AccountActivation.deleteOne({ _id: activation.id });
    if (user) await User.deleteOne({ _id: user.id });
    if (employee) await Employee.deleteOne({ _id: employee.id });
    throw error;
  }
}

module.exports = { createEmployee };