const mongoose = require('mongoose');
const { number } = require('joi');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema({
  title: { type: String, trim: true },
  color: {
    //  #f4b332
    type: String,
    lowercase: true,
    minlength: 7,
    maxlength: 7,
  },
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
    tag: tagSchema,
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
