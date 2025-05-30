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
 * @param {string} subject - Receiver's subject
 * @param {string} text - Email body
 */

const sendMail = async (to,subject, text) => {
    console.log(to,text)
  const mailOptions = {
    from: `"ERAM" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
