const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  },
  passwordHash: String,
  accountStatus: {
    type: String,
    enum: ["active","inActive"],
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
  qualifications: [
    {
      degree: String,
      institution: String,
      year: Number,
    },
  ],
  skills: [String],
  resumeUrl: String,
  experienceYears: Number,

  // Client||Company fields
  companyName: String,
  companyWebsite: String,

  Category: {
    type: String,
  },
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
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
