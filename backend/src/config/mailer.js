const nodemailer = require('nodemailer');
const { env } = require('./env');

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mailHost,
      port: env.mailPort,
      secure: env.mailSecure,
      auth: { user: env.mailUser, pass: env.mailPassword },
    });
  }
  return transporter;
}

async function sendMail(message) {
  if (env.mailMode === 'console') {
    console.log('\n--- DEVELOPMENT EMAIL ---');
    console.log(`To: ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(message.text);
    console.log('--- END EMAIL ---\n');
    return { messageId: 'console-preview' };
  }

  if (!env.mailUser || !env.mailPassword || !env.mailFrom) {
    console.warn('SMTP mail configuration is incomplete; falling back to console email');
    console.log('\n--- DEVELOPMENT EMAIL ---');
    console.log(`To: ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(message.text);
    console.log('--- END EMAIL ---\n');
    return { messageId: 'console-preview' };
  }

  return getTransporter().sendMail({ from: env.mailFrom, ...message });
}

module.exports = { sendMail };
