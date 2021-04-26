const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().required().min(3).max(255),
    parent: Joi.string().required().custom(objectId),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    categoryName: Joi.string(),
    categoryType: Joi.string(),
    hitCount: Joi.number().integer(),
    parent: Joi.string().custom(objectId),
    populate: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    _sort: Joi.string(),
    _oeder: Joi.string(),
    _start: Joi.number(),
    _end: Joi.number(),
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
  body: Joi.object().keys({
    categoryName: Joi.string().min(3).max(255),
  }),
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
