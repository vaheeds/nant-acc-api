const httpStatus = require('http-status');
const { Account } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get account by id
 * @param {ObjectId} id
 * @returns {Promise<Account>}
 */
const getAccountById = async (id) => {
  const result = await Account.findById(id);
  return result;
};

/**
 * Create an account
 * @param {Object} accountBody
 * @returns {Promise<Account>}
 */
const createAccount = async (accountBody) => {
  if (await Account.isDuplicate(accountBody.accountName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account is already exist');
  }
  const account = await Account.create(accountBody);
  return account;
};

/**
 * Query for accounts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAccounts = async (filter, options) => {
  const accounts = await Account.paginate(filter, options);
  return accounts;
};

/**
 * Update account by id
 * @param {ObjectId} accountId
 * @param {Object} updateBody
 * @returns {Promise<Account>}
 */
const updateAccountById = async (accountId, updateBody) => {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  if (await Account.isDuplicate(updateBody.accountName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The same account is already exist');
  }
  Object.assign(account, updateBody);
  await account.save();
  return account;
};

/**
 * Delete account by id
 * @param {ObjectId} accountId
 * @returns {Promise<Account>}
 */
const deleteAccountById = async (accountId) => {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  await account.remove();
  return account;
};

module.exports = {
  createAccount,
  queryAccounts,
  getAccountById,
  updateAccountById,
  deleteAccountById,
};
