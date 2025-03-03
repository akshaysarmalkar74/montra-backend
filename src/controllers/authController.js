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
