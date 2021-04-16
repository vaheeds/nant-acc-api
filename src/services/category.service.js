const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const result = await Category.findById(id);
  return result;
};

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  const body = categoryBody;
  const parent = await getCategoryById(body.parent);
  if (!parent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parent is not found');
  }
  // check if parent has same child already
  const duplicateFound = parent.children.filter((ch) => ch.categoryName === body.categoryName);
  if (duplicateFound.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Same level category is already exists');
  }
  // client not allowed to set categoryType, we set it here
  body.categoryType = parent.categoryType;

  const category = await Category.create(body);
  parent.children.push(category);
  await parent.save();
  return category;
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.).
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, options);
  return categories;
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
  if (!category.parent) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Editing root categories are not allowed');
  }
  const parent = await getCategoryById(category.parent);
  const duplicateFound = parent.children.filter((ch) => ch.categoryName === updateBody.categoryName);
  if (duplicateFound.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Same categoryName is already exists');
  }

  const childIndex = parent.children.findIndex((x) => x.categoryName === category.categoryName);
  parent.children[childIndex].categoryName = updateBody.categoryName;
  await parent.save();
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
  if (category.children.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category has one or more children, delete them first');
  }
  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
