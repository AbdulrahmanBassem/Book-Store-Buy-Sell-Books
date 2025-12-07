const router = require("express").Router();
const { register, login, verify, resendOtp } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-otp", resendOtp);

module.exports = router;
