const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required().min(3).max(255),
    parentId: Joi.string().custom(objectId),
    hitCount: Joi.number(),
    isIncome: Joi.boolean().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    categoryName: Joi.string(),
    isIncome: Joi.boolean(),
    hitCount: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      categoryName: Joi.string(),
      hitCount: Joi.number(),
      isIncome: Joi.boolean(),
      parentId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
