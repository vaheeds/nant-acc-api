const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema({
  title: { type: String, trim: true },
  color: { type: String, trim: true },
});

// add plugin that converts mongoose to json
tagSchema.plugin(toJSON);
tagSchema.plugin(paginate);

/**
 * Check if tag is a duplicated one
 * @param {string} title - The tag title
 * @returns {Promise<boolean>}
 */
tagSchema.statics.isDuplicate = async function (title) {
  const tag = await this.findOne({ title });
  return !!tag;
};

/**
 * @typedef Tag
 */
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
