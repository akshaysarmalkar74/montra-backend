const express = require("express");
const { registerUser, verifyCodeAndRegister, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-code", verifyCodeAndRegister);
router.post("/login", loginUser);

module.exports = router;
