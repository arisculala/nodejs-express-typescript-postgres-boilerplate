const mongoose = require('mongoose');

const userDataAccess = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dataSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  accessLevel: {
    //e.g. 'read', 'write', 'admin'
    type: String,
    required: true,
    unique: true,
  },
  createdDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model(
  'UserDataAccess',
  userDataAccess,
  'UserDataAccess'
);
