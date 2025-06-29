const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  role: {
    type: String,
    enum: ["admin", "recruiter", "super_admin", "candidate", "employee"],
  },
  email: { type: String, required: true },
  newEmail: {type: String},
  phone: String,
  passwordHash: String,  
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 180, 
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
