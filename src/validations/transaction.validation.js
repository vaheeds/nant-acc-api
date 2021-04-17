const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    fromAccount: Joi.string().custom(objectId),
    toAccount: Joi.string().custom(objectId),
    category: Joi.string().required().custom(objectId),
    date: Joi.date().required(),
    amount: Joi.number().required().min(0),
    descr: Joi.string().required(),
    tag: Joi.object({
      title: Joi.string(),
      color: Joi.string(),
    }),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    fromAccount: Joi.string().custom(objectId),
    fromAccountName: Joi.string(),
    toAccount: Joi.string().custom(objectId),
    toAccountName: Joi.string(),
    category: Joi.string().custom(objectId),
    categoryName: Joi.string(),
    categoryType: Joi.string(),
    date: Joi.date(),
    amount: Joi.number().min(0),
    descr: Joi.string(),
    tag: Joi.object({
      title: Joi.string(),
      color: Joi.string(),
    }),
    populate: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

const updateTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      fromAccount: Joi.string().custom(objectId),
      toAccount: Joi.string().custom(objectId),
      category: Joi.string().custom(objectId),
      date: Joi.date(),
      amount: Joi.number().min(0),
      descr: Joi.string(),
      tag: Joi.object({
        title: Joi.string(),
        color: Joi.string(),
      }),
    })
    .min(1),
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
