const mongoose = require('mongoose');

// create login schema
const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, default: 'user' },
  emailsent: { type: Number, default: 0 },
  textsent: { type: Number, default: 0 },
  outboundcall: { type: Number, default: 0 },
  phoneNumber: { type: Number },
  firstName: String,
  lastName: String,
  roles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'RoleAccess',
      required: true,
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
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('User', user, 'User');
