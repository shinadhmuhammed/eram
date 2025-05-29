const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  fullName: String,
  role: {
    type: String,
    enum: ["admin", "recruiter", "client", "candidate", "employee"],
  },
  email: { type: String, required: true },
  phone: String,
  passwordHash: String,  
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
