const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL || "thasnimaskeva.io@gmail.com",
    pass: process.env.SMTP_APP_PASSWORD || "gavu cgwx hjhd etwm",
  },
});

/**
 * Sends an email using Gmail SMTP.
 * @param {string} to - Receiver's email
 * @param {string} subject - Subject of the email
 * @param {string} text - Body text of the email
 */

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: `"MyApp" <${process.env.SMTP_EMAIL }>`,
    to,
    subject,
    text,
  };
  

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
