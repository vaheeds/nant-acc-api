const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { categoryTypes } = require('../config/category');

const categorySchema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    hitCount: {
      type: Number,
      default: 0,
    },
    categoryType: {
      type: String,
      enum: categoryTypes,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * Check if Category is a duplicated one
 * @param {string} categoryName - The category name
 * @param {ObjectId} [parentId] - The id of the category's parent
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isDuplicate = async function (categoryName, parentId) {
  const category = await this.findOne({ categoryName, parentId });
  return !!category;
};

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
