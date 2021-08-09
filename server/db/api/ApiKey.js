const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user_type: {
    type: String,
    required: true,
    index: true,
  },
  name: String,
  owner: {
    type: String,
    index: true,
  },
  iat: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { collection: 'api_keys' });

class ApiKeyClass extends BaseClass {
  static async add(apiKey) {
    return this.create({
      ...apiKey,
      iat: new Date(),
    });
  }

  static async getByKey(key) {
    const keyDoc = await this.findOne({ key });
    if (!keyDoc) {
      throw new Error('ApiKey not found');
    }
    return keyDoc.toObject();
  }
}

mongoSchema.loadClass(ApiKeyClass);

const ApiKey = api.model('ApiKey', mongoSchema);

module.exports = ApiKey;
