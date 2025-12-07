const otpGenerator = require("otp-generator");

const generateOTP = () => {
  // Generate OTP + Expires
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpires = Date.now() + 10 * 60 * 1000;

  return { otp, otpExpires };
};

module.exports = generateOTP;
