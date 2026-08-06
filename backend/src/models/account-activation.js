const mongoose = require('mongoose');

const accountActivationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activationTokenHash: { type: String, required: true, unique: true },
    activationExpiresAt: { type: Date, required: true },
    otpHash: { type: String, select: false },
    otpExpiresAt: Date,
    lastOtpSentAt: Date,
    otpAttempts: { type: Number, default: 0 },
    otpVerifiedAt: Date,
    usedAt: Date,
  },
  { timestamps: true }
);

accountActivationSchema.index({ activationExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AccountActivation', accountActivationSchema);
