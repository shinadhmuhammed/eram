const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
    required:true
  },
  location: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    branch_phoneno: String,
    branch_email: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  brand_logo: {
    type: String,
    required:true
  },
  home: {
    title: String,
    bannerImage: String,
    herosectionOne: String,
  },
  about: {
    title: String,
    description: String,
  },
  services: [
    {
      name: String,
      price: Number,
    },
  ],
  contact: {
    email: String,
    phone: String,
  },
}, { timestamps: true });

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;
