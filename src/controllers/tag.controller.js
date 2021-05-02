const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tagService } = require('../services');

const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.body);
  res.status(httpStatus.CREATED).send(tag);
});

const getTags = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'color']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tagService.queryTags(filter, options);
  res.send(result);
});

const getTag = catchAsync(async (req, res) => {
  const tag = await tagService.getTagById(req.params.tagId);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }
  res.send(tag);
});

const updateTag = catchAsync(async (req, res) => {
  const tag = await tagService.updateTagById(req.params.tagId, req.body);
  res.send(tag);
});

const deleteTag = catchAsync(async (req, res) => {
  await tagService.deleteTagById(req.params.tagId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
};
