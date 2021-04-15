const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { categoryTypes } = require('../config/category');

const categorySchema = mongoose.Schema(
  {
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category',
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

// adding Array of child categories after initialization
categorySchema.add({ children: [categorySchema] });

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
