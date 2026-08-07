const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = require('../src/app');
const User = require('../src/models/user');
const Employee = require('../src/models/employee');
const AccountActivation = require('../src/models/account-activation');

let server;
let baseUrl;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...options.headers },
  });
  return { status: response.status, body: await response.json() };
}

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    AccountActivation.deleteMany({}),
  ]);
  await User.create({
    email: 'hr@test.local',
    passwordHash: await bcrypt.hash('HrPassword123', 12),
    role: 'hr',
    status: 'active',
  });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    AccountActivation.deleteMany({}),
  ]);
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
});

test('complete HR-to-employee activation and login flow', async () => {
  const hrLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'hr@test.local', password: 'HrPassword123' }),
  });
  assert.equal(hrLogin.status, 200);
  assert.equal(hrLogin.body.data.user.role, 'hr');
  const hrToken = hrLogin.body.data.token;

  const unauthorized = await request('/api/employees', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  assert.equal(unauthorized.status, 401);

  const created = await request('/api/employees', {
    method: 'POST',
    headers: { authorization: `Bearer ${hrToken}` },
    body: JSON.stringify({
      employeeNumber: 'EMP-001',
      firstName: 'Test',
      lastName: 'Employee',
      workEmail: 'employee@test.local',
      personalEmail: 'employee.personal@test.local',
      phone: '+94770000000',
      address: 'Colombo',
      university: 'University of Colombo',
      previousCompany: 'ACME Ltd',
      previousJobTitle: 'Junior Developer',
      yearsOfExperience: '3',
      department: 'Engineering',
      jobTitle: 'Developer',
      role: 'employee',
    }),
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.data.employee.workEmail, 'employee@test.local');
  assert.equal(created.body.data.employee.previousCompany, 'ACME Ltd');
  const activationRecord = await AccountActivation.findOne({}).lean();
  assert.ok(activationRecord);
  assert.equal(created.body.data.activationUrl, undefined);
});
