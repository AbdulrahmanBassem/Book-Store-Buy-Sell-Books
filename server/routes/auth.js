const router = require("express").Router();
const { register, login, verify, resendOtp, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password", resetPassword);   

module.exports = router;
