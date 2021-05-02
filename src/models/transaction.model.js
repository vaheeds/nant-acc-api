const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema({
  title: { type: String, trim: true },
  color: { type: String, trim: true },
});

const transactionSchema = mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
    },
    fromAccountName: String,
    toAccount: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account',
    },
    toAccountName: String,
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
      required: true,
    },
    categoryName: String,
    categoryType: String,
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    descr: {
      type: String,
      required: true,
    },
    tags: [tagSchema],
    remaining: Number,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
