const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  tickerSymbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  // Optionally store the number of shares (may be fractional).
  shares: {
    type: Number,
    default: undefined,
  },
  // Optionally store the dollar amount to invest.
  dollarAmount: {
    type: Number,
    default: undefined,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
});

// Custom pre-validation: require at least one of shares or dollarAmount.
positionSchema.pre('validate', function (next) {
  const hasShares = this.shares !== undefined && this.shares !== null;
  const hasDollarAmount = this.dollarAmount !== undefined && this.dollarAmount !== null;
  if (!hasShares && !hasDollarAmount) {
    return next(new Error('Either "shares" or "dollarAmount" must be provided.'));
  }
  next();
});

// Overall portfolio schema.
const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one portfolio per user
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  positions: [positionSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically update the updatedAt field on save.
portfolioSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
