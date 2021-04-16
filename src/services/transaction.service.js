const httpStatus = require('http-status');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');
const accountService = require('./account.service');
const categoryService = require('./category.service');

/**
 * Get transaction by id
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (id) => {
  const result = await Transaction.findById(id);
  return result;
};

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionBody) => {
  const body = transactionBody;
  const fromAccount = await accountService.getAccountById(body.fromAccount);
  const toAccount = await accountService.getAccountById(body.toAccount);
  const category = await categoryService.getCategoryById(body.category);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category is not found');
  }
  if (!fromAccount && !toAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'At least one account is needed');
  }
  // client not allowed to set some peoperties, we set it here
  body.fromAccountName = fromAccount && fromAccount.accountName;
  body.toAccountName = toAccount && toAccount.accountName;
  body.categoryName = category.categoryName;
  body.categoryType = category.categoryType;

  category.hitCount += 1;
  await category.save();

  if (fromAccount) {
    fromAccount.hitCount += 1;
    await fromAccount.save();
  }
  if (toAccount) {
    toAccount.hitCount += 1;
    await toAccount.save();
  }

  const transaction = await Transaction.create(body);
  return transaction;
};

/**
 * Query for transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.).
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

/**
 * Update transaction by id
 * @param {ObjectId} transactionId
 * @param {Object} updateBody
 * @returns {Promise<Transaction>}
 */
const updateTransactionById = async (transactionId, updateBody) => {
  const body = updateBody;
  const transaction = await getTransactionById(transactionId);

  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  if (body.category) {
    if (transaction.category !== body.category) {
      const oldCategory = await categoryService.getCategoryById(transaction.category);
      const newCategory = await categoryService.getCategoryById(body.category);
      oldCategory.hitCount -= 1;
      await oldCategory.save();
      newCategory.hitCount += 1;
      await newCategory.save();
      body.categoryName = newCategory.categoryName;
      body.categoryType = newCategory.categoryType;
    }
  }
  if (body.fromAccount) {
    if (transaction.fromAccount !== body.fromAccount) {
      const oldFromAccount = await accountService.getAccountById(transaction.fromAccount);
      const newFromAccount = await accountService.getAccountById(body.fromAccount);
      oldFromAccount.hitCount -= 1;
      await oldFromAccount.save();
      newFromAccount.hitCount += 1;
      await newFromAccount.save();
      body.fromAccountName = newFromAccount.accountName;
    }
  }
  if (body.toAccount) {
    if (transaction.toAccount !== body.toAccount) {
      const oldToAccount = await accountService.getAccountById(transaction.toAccount);
      const newToAccount = await accountService.getAccountById(body.toAccount);
      oldToAccount.hitCount -= 1;
      await oldToAccount.save();
      newToAccount.hitCount += 1;
      await newToAccount.save();
      body.toAccountName = newToAccount.accountName;
    }
  }

  Object.assign(transaction, body);
  await transaction.save();
  return transaction;
};

/**
 * Delete transaction by id
 * @param {ObjectId} transactionId
 * @returns {Promise<Transaction>}
 */
const deleteTransactionById = async (transactionId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await transaction.remove();
  return transaction;
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
};
