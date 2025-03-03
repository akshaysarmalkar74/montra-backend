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
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
};

module.exports = { sendVerificationEmail };
