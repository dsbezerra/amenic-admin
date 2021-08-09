const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

class AdminClass extends BaseClass {
  static async add({ username, password }) {
    return this.create({
      username,
      password,
      createdAt: new Date(),
    });
  }

  static async getByUsername(username) {
    const adminDoc = await this.findOne({ username });
    if (!adminDoc) {
      throw new Error('Admin not found');
    }

    const admin = adminDoc.toObject();
    return admin;
  }
}

mongoSchema.loadClass(AdminClass);

const Admin = api.model('Admin', mongoSchema);

module.exports = Admin;
