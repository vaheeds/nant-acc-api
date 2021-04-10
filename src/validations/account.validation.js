const Joi = require('joi');

const createAccount = {
  body: Joi.object().keys({
    accountName: Joi.string().required().min(3).max(255),
    initBalance: Joi.number().integer().required().min(0),
    archived: Joi.boolean(),
    descr: Joi.string().max(512),
    sortOrder: Joi.number().min(0),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    accountName: Joi.string(),
    initBalance: Joi.number(),
    archived: Joi.boolean(),
    descr: Joi.string(),
    sortOrder: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

const updateAccount = {
  params: Joi.object().keys({
    accountId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      accountName: Joi.string(),
      hitCount: Joi.number().integer(),
      isIncome: Joi.boolean(),
      parentId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteAccount = {
  params: Joi.object().keys({
    accountId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAccount,
  getCategories,
  getAccount,
  updateAccount,
  deleteAccount,
};
