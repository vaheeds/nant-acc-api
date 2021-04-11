const mongoose = require('mongoose');
const { number } = require('joi');
const { toJSON, paginate } = require('./plugins');
const { flags } = require('../config/account');

const transactionSchema = mongoose.Schema(
  {
    amount: {
      type: number,
      required: true,
      min: 0,
    },
    descr: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: flags,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * Check if Transaction is a duplicated one
 * @param {string} transactionName - The transaction name
 * @param {ObjectId} [parentId] - The id of the transaction's parent
 * @returns {Promise<boolean>}
 */
transactionSchema.statics.isDuplicate = async function (transactionName, parentId) {
  const transaction = await this.findOne({ transactionName, parentId });
  return !!transaction;
};

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
