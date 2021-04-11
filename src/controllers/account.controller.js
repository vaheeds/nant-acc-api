const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { accountService } = require('../services');

const createAccount = catchAsync(async (req, res) => {
  const account = await accountService.createAccount(req.body);
  res.status(httpStatus.CREATED).send(account);
});

const getAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['accountName', 'initBalance', 'archived', 'sortOrder']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await accountService.queryAccounts(filter, options);
  res.send(result);
});

const getAccount = catchAsync(async (req, res) => {
  const account = await accountService.getAccountById(req.params.accountId);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  res.send(account);
});

const updateAccount = catchAsync(async (req, res) => {
  const account = await accountService.updateAccountById(req.params.accountId, req.body);
  res.send(account);
});

const deleteAccount = catchAsync(async (req, res) => {
  await accountService.deleteAccountById(req.params.accountId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
