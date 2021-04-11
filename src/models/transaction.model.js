const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    fromAccId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    toAccId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    transactionName: {
      type: String,
      required: true,
      trim: true,
    },
    hitCount: {
      type: Number,
      default: 0,
    },
    isIncome: {
      type: Boolean,
      required: true,
      default: false,
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
