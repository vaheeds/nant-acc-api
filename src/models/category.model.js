const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { categoryTypes } = require('../config/category');

const categorySchema = mongoose.Schema(
  {
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

// adding Array of child categories after initialization
categorySchema.add({ children: [categorySchema] });

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * Check if Category is a duplicated one
 * @param {string} categoryName - The category name
 * @param {string} categoryType - The type of the category
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isDuplicate = async function (categoryName, categoryType) {
  const category = await this.findOne({ categoryName, categoryType });
  return !!category;
};

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
