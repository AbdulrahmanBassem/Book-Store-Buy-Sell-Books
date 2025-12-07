const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};


exports.register = async (req, res, next) => {
  try {
    const {name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const { otp, otpExpires } = generateOTP();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    // Send OTP Email
    try {
      await sendEmail({
        email: user.email,
        subject: "BookStore Account Verification",
        message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
      });

      res.status(201).json({
        success: true,
        message: `Registered! An OTP has been sent to ${email}`,
        userId: user._id, 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify User
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login.",
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please add email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      // CHECK IF VERIFIED
      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    // 1. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    // 3. Generate new OTP
    const { otp, otpExpires } = generateOTP();

    // 4. Update User
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // 5. Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "BookStore - Resend Verification Code",
        message: `Your new verification code is: ${otp}. It expires in 10 minutes.`,
      });

      res.status(200).json({
        success: true,
        message: "New OTP sent to your email",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};