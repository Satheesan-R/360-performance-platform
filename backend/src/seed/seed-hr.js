const bcrypt = require('bcrypt');
const connectDatabase = require('../config/db');
const { validateEnv } = require('../config/env');
const User = require('../models/user');

async function seedHr() {
  validateEnv();
  const email = process.env.HR_EMAIL?.toLowerCase().trim();
  const password = process.env.HR_PASSWORD;
  if (!email || !password) throw new Error('HR_EMAIL and HR_PASSWORD are required');
  if (password.length < 8) throw new Error('HR_PASSWORD must be at least 8 characters');

  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email },
    { email, passwordHash, role: 'hr', status: 'active' },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  console.log(`HR account ready: ${user.email}`);
}

seedHr().then(() => process.exit(0)).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
