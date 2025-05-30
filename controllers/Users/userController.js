// @ts-nocheck
const dotenv = require("dotenv");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMail = require("../../utils/mailer");
const OTP = require("../../models/OTPModel");

const register = async (req, res) => {
  try {
    const { firstName, lastName, fullName, role, email, phone, cPassword } =
      req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cPassword, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let subject = "ERAM OTP Verification"
    const text = `Hi ${firstName},\n\nYour OTP is: ${otp}\nThis OTP will expire in 3 minutes.\n\nThank you,\nERAM Team`;
    await sendMail(email, subject,text);

    await OTP.create({
      firstName,
      lastName,
      fullName,
      role,
      email,
      phone,
      passwordHash: hashedPassword,
      otp,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { firstName, lastName, fullName, role, phone, passwordHash } =
      otpRecord;

    const newUser = new User({
      firstName,
      lastName,
      fullName,
      role,
      email,
      phone,
      passwordHash,
    });

    await newUser.save();
    await OTP.deleteOne({ email });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        name: user.fullName,
        roles: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({ message: "No OTP request found for this email" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpRecord.otp = newOtp;
    otpRecord.createdAt = new Date(); 
    await otpRecord.save();

    const subject =  "ERAM OTP Verification";
    const text = `Hi ${otpRecord.firstName},\n\nYour new OTP is: ${newOtp}\nIt will expire in 3 minutes.\n\nThank you,\nERAM Team`;
    await sendMail(email, subject, text);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
};



const getDashboardData = async (req, res) => {
  try {
    console.log("User info from token:", req.user);
    return res.status(200).json({ message: "checking jwt verification...!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error..!" });
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  getDashboardData,
};
