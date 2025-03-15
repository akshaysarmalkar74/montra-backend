const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../services/emailService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    console.log("Register request received:", req.body); // ✅ Debug log

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

    const newUser = new User({ name, email, password, verificationCode, verificationCodeExpires });
    await newUser.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Verify Code And Register
exports.verifyCodeAndRegister = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email, verificationCode: code, verificationCodeExpires: { $gt: new Date() } });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60000); // 15 minutes expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `montra://reset-password?token=${resetToken}&email=${email}`;
    const emailContent = `
      <p>Dear ${user.name},</p>
      <p>We received a request to reset your password for your account associated with this email address.</p>
      <p>If you made this request, please click the link below to reset your password:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>This link will expire in 15 minutes. If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      <p>Thank you,</p>
      <p>The Montra Team</p>
    `;

    await sendVerificationEmail(email, emailContent, { isHtml: true });

    res.status(200).json({ message: "Password reset instructions sent to email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Error processing forgot password request", error: error.message });
  }
};

// Setup PIN
exports.setupPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: "Email and PIN are required" });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: "PIN must be a 4-digit number" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pin = pin;
    await user.save();

    res.status(200).json({ message: "PIN setup successfully" });
  } catch (error) {
    console.error("Error setting up PIN:", error);
    res.status(500).json({ message: "Error setting up PIN", error: error.message });
  }
};

// Verify PIN
exports.verifyPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: "Email and PIN are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.pin !== pin) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    res.status(200).json({ message: "PIN verified successfully" });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    res.status(500).json({ message: "Error verifying PIN", error: error.message });
  }
};
