const mongoose = require('mongoose');

const dataset = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  ownerTenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  sharedWithTenants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tenant',
    },
  ],
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

module.exports = mongoose.model('Dataset', dataset, 'Dataset');
