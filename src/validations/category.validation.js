const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required().min(3).max(255),
    hitCount: Joi.number().integer().min(0),
    categoryType: Joi.string().required().valid('income', 'expense', 'transfer'),
    children: Joi.array(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    categoryName: Joi.string(),
    categoryType: Joi.string(),
    hitCount: Joi.number().integer(),
    children: Joi.array(),
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
      hitCount: Joi.number().integer(),
      categoryType: Joi.string(),
      children: Joi.array(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const addChildCategory = {
  params: Joi.object().keys({
    parentId: Joi.string().custom(objectId),
    childId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  addChildCategory,
};
