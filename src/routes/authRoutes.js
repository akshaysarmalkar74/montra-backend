const express = require("express");
const {
  registerUser,
  verifyCodeAndRegister,
  loginUser,
  forgotPassword,
  setupPin,
  verifyPin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-code", verifyCodeAndRegister);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/setup-pin", setupPin);
router.post("/verify-pin", verifyPin);

module.exports = router;
