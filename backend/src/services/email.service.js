const { sendMail } = require('../config/mailer');

async function sendActivationEmail({ employee, activationUrl }) {
  return sendMail({
    to: employee.workEmail,
    subject: 'Activate your Performance Platform account',
    text: `Hello ${employee.firstName},\n\nYour employee account is ready. Activate it here:\n${activationUrl}\n\nThis link expires soon. If you did not expect this email, contact HR.`,
  });
}

async function sendOtpEmail({ employee, otp, minutes }) {
  return sendMail({
    to: employee.workEmail,
    subject: 'Your account activation OTP',
    text: `Hello ${employee.firstName},\n\nYour verification code is: ${otp}\n\nIt expires in ${minutes} minutes. Do not share this code.`,
  });
}

module.exports = { sendActivationEmail, sendOtpEmail };
