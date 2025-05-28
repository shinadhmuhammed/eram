const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  action: {
    type: String
  }
}, { timestamps: true });

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
