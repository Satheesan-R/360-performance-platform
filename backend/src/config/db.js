const mongoose = require('mongoose');
const { env } = require('./env');

async function connectDatabase() {
  await mongoose.connect(env.mongoUri);

  try {
    const indexes = await mongoose.connection.collection('employees').listIndexes().toArray();
    const hasLegacyPersonalEmailIndex = indexes.some((index) => index.name === 'personalEmail_1');
    if (hasLegacyPersonalEmailIndex) {
      await mongoose.connection.collection('employees').dropIndex('personalEmail_1');
      console.log('Dropped legacy personalEmail index');
    }
  } catch (error) {
    if (error?.codeName !== 'IndexNotFound' && error?.code !== 27) {
      throw error;
    }
  }

  console.log('Connected to MongoDB');
}

module.exports = connectDatabase;
