/* eslint-disable class-methods-use-this */
const pluralize = require('mongoose').pluralize();

class BaseClass {
  static async getById(id, {
    populate = [],
  } = {}) {
    const doc = await this.findById(id)
      .populate(populate)
      .lean();
    if (!doc) {
      throw new Error(`${this.modelName} not found`);
    }

    return doc;
  }

  static async edit({
    _id,
    ...modified
  }) {
    const doc = await this.findById(_id);
    if (!doc) {
      throw new Error(`${this.modelName} not found`);
    }

    const { ok } = await this.updateOne({ _id }, {
      $set: {
        ...modified,
        updatedAt: new Date(),
      },
    });
    return { ok };
  }

  static async delete(id) {
    const doc = await this.findById(id);
    if (!doc) {
      throw new Error(`${this.modelName} not found`);
    }
    return doc.remove();
  }

  static async list({
    conditions = {},
    select = '',
    offset = 0,
    limit = 10,
    sort = {},
    populate = [],
    paginated = false,
  } = {}) {
    const docs = await this.find(conditions)
      .select(select)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .populate(populate)
      .lean();

    const res = { [pluralize(this.modelName)]: docs };
    if (paginated) {
      const totalCount = await this.count(conditions);
      res.totalCount = totalCount;
      res.hasNextPage = offset + docs.length < totalCount && docs.length !== 0;
      res.hasPreviousPage = offset > 0;
    }

    return res;
  }
}

module.exports = BaseClass;
