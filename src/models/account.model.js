const mongoose = require('mongoose');
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

const accountSchema = mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    initBalance: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    archived: {
      type: Boolean,
    },
    descr: {
      type: String,
      trim: true,
    },
    hitCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [tagSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

/**
 * Check if account is a duplicated one
 * @param {string} accountName - The account name
 * @returns {Promise<boolean>}
 */
accountSchema.statics.isDuplicate = async function (accountName) {
  const account = await this.findOne({ accountName });
  return !!account;
};

/**
 * @typedef Account
 */
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
