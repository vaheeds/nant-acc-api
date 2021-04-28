/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} data - Results found
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options._sort] - Sorting field
   * @param {string} [options._order] - Sorting order
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options._start] - Start index of requested results (default = 0)
   * @param {number} [options._end] - End index of requested results (default = 10)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = '';
    if (options._sort) {
      sort = (options._order === 'DESC' ? '-' : '') + options._sort;
    } else {
      sort = 'createdAt';
    }

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter)
      .sort(sort)
      .skip(options._start)
      .limit(options._end - options._start);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, data] = values;
      const result = {
        data,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
