const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: String,
  accountStatus: {
    type: String,
    enum: ["active", "inActive"],
    default: "active",
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "recruiter", "super_admin", "candidate", "employee"],
    index: true,
  },
  dob: Date,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  specialization: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  skills: [String],
  resumeUrl: String,

  companyName: String,
  companyWebsite: String,

  website_url: {
    type: String,
  },
  description: {
    type: String,
  },
  employees_count: {
    type: String,
  },
  partnership: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
