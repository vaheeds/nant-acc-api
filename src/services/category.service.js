const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  if (await Category.isDuplicate(categoryBody.categoryName, categoryBody.categoryType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category is already exist');
  }
  const category = await Category.create(categoryBody);
  return category;
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  if (await Category.isDuplicate(updateBody.categoryName, updateBody.parentId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The same category is already exist');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

/**
 * Add a category as a child to another categorry
 * @param {ObjectId} parentId
 * @param {ObjectId} childId
 * @returns {Promise<Category>}
 */
const addChildCategoryById = async (parentId, childId) => {
  const parent = await getCategoryById(parentId);
  const child = await getCategoryById(childId);
  if (!parent || !child) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One category not found');
  }
  parent.children.push(child);
  await parent.save();
  return parent;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  addChildCategoryById,
};
