const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAccount = {
  body: Joi.object().keys({
    accountName: Joi.string().required().min(3).max(255),
    initBalance: Joi.number().required().min(0),
    archived: Joi.boolean(),
    descr: Joi.string().max(512),
    tags: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const getAccounts = {
  query: Joi.object().keys({
    accountName: Joi.string(),
    initBalance: Joi.number(),
    archived: Joi.boolean(),
    descr: Joi.string(),
    hitCount: Joi.number().integer(),
    tags: Joi.array().items(Joi.string().custom(objectId)),
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
      accountName: Joi.string().min(3).max(255),
      initBalance: Joi.number().min(0),
      archived: Joi.boolean(),
      descr: Joi.string().max(512),
      tags: Joi.array().items(Joi.string().custom(objectId)),
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
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
};
