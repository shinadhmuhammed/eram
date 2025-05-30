const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
