const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Thank you for registering. Please use the following verification code to complete your registration. This code will expire in 10 minutes. \n\nVerification Code: ${code}`,
  });
};

module.exports = { sendVerificationEmail };
