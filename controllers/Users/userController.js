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

    let subject = "ERAM OTP Verification";
    const text = `Hi ${firstName},\n\nYour OTP is: ${otp}\nThis OTP will expire in 3 minutes.\n\nThank you,\nERAM Team`;
    await sendMail(email, subject, text);

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
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (user.role === "super_admin") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await OTP.deleteMany({ email: user.email });

      await OTP.create({
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
        passwordHash: user.passwordHash,
        otp,
      });

      const subject = user.fullName;
      const text = `Hi ${user.firstName},\n\nYour admin OTP is: ${otp}\nThis OTP will expire in 3 minutes.\n\n- ERAM Team`;

      await sendMail(user.email, subject, text);

      return res.status(202).json({
        message:
          "OTP sent to super_admin. Please verify OTP to complete login.",
        requireOtp: true,
        email: user.email,
      });
    }

    res.cookie(user.role, token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
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


const logout = async (req,res) => {
  const role = req.user.role
  try {
    res.clearCookie(role, {
    httpOnly: true,
    secure: false,    
    sameSite: 'Lax', 
  });
  res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" });
  }
}

const verifyAdminLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTP.deleteOne({ email });

    const user = await User.findOne({ email });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("super_admin", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Admin OTP verification successful!",
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
      return res
        .status(404)
        .json({ message: "No OTP request found for this email" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpRecord.otp = newOtp;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    const subject = "ERAM OTP Verification";
    const text = `Hi ${otpRecord.firstName},\n\nYour new OTP is: ${newOtp}\nIt will expire in 3 minutes.\n\nThank you,\nERAM Team`;
    await sendMail(email, subject, text);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
};

const requestUpdateProfile = async (req, res) => {
  const userEmail = req.user.email;
  const { newEmail, password } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: userEmail });

    await OTP.create({
      email: userEmail,
      newEmail,
      passwordHash: hashedPassword,
      otp,
    });

    const subject = "OTP for Profile Update";
    const text = `Hi ${user.fullName},\n\nYour OTP is: ${otp}\nIt will expire in 3 minutes.\n\n- ERAM Team`;

    await sendMail(userEmail, subject, text);

    res.status(200).json({ message: "OTP sent for profile update" });
  } catch (err) {
    console.error("Error in requestUpdateProfile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUpdateProfile = async (req, res) => {
  const userEmail = req.user.email;
  const { otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email: userEmail });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const { newEmail, passwordHash } = otpRecord;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = newEmail;
    user.passwordHash = passwordHash;
    await user.save();

    await OTP.deleteOne({ email: userEmail });
    const newToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      token: newToken,
      updatedUser: {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error("Error in verifyUpdateProfile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  verifyOtp,
  verifyAdminLoginOtp,
  resendOtp,
  login,
  logout,
  requestUpdateProfile,
  verifyUpdateProfile,
};
