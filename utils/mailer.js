const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

/**
 * Sends an email using Gmail SMTP with async/await and error handling
 * @param {string} to - Receiver's email
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 */
const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: `"MyApp" <${process.env.SMTP_EMAIL || "thasnimaskeva.io@gmail.com"}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
