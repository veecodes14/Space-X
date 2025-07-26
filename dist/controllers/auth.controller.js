"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOTP = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const OTP_1 = __importDefault(require("../utils/OTP"));
const OTPVerification_model_1 = __importDefault(require("../models/OTPVerification.model"));
const email_transporter_1 = require("../utils/email.transporter");
require('dotenv').config();
// JWT
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}
//@route POST /api/v1/auth/register
//@desc Sign Up User (Create User and Hash Password)
//@access Public
const register = async (req, res) => {
    try {
        console.log("📩 Registration request received:", req.body);
        const { name, gender, role, username, email, phone, password } = req.body;
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists:", email);
            res.status(409).json({
                success: false,
                message: "User already exists"
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.User({ name, gender, email, username, role, phone, password: hashedPassword });
        await newUser.save();
        console.log("✅ New user saved:", newUser._id);
        // res.status(201).json({message: `User, ${name} registered`})
        // const otp = generateOTP();
        // const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        // const newOtpVerification = new OTPVerification({
        // userId: newUser._id,
        // email,
        // otp,
        // expiresAt: otpExpires,
        // });
        // await newOtpVerification.save();
        // console.log("✅ OTP saved:", otp);
        // await sendEmail({
        // to: email,
        // subject: 'Verify your account',
        // text: `Hi ${name}, your OTP for registration is ${otp}. It will expire in 10 minutes.`,
        // });
        // console.log("📧 Email sent to:", email);
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });
    }
    catch (error) {
        console.log({ message: "Error signing up user", error: error });
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};
exports.register = register;
//@route POST /api/v1/auth/login
//@desc Login User (Login User and Generate JWT)
//@access Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
            return;
        }
        const existingUser = await user_model_1.User.findOne({ email, isAccountDeleted: false }).select('+password');
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found. Please sign up."
            });
            return;
        }
        // if (!existingUser.isVerified) {
        // res.status(403).json({
        //     success: false,
        //     message: 'Please verify your email before logging in.'
        //     });
        //     return;
        // }
        const isPasswordValid = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser?._id,
            role: existingUser?.role,
            email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const UserWithoutPassword = existingUser.toObject();
        delete UserWithoutPassword.password;
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: UserWithoutPassword
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required to reset your password'
            });
            return;
        }
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            res.status(200).json({
                success: true,
                message: "OTP sent if user exists"
            });
            return;
        }
        const otp = (0, OTP_1.default)();
        const hashedOtp = await bcrypt_1.default.hash(otp, 10);
        await OTPVerification_model_1.default.deleteMany({ email });
        // save otp to db
        await new OTPVerification_model_1.default({
            userId: user._id,
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000,
        }).save();
        // email html content
        const emailText = ` Hello ${user.name},
        You have requested to reset your password.
        Use the OTP below to proceed:
        OTP: ${otp}

        ------------------------
        
        Note: This OTP will expire in 10 minutes.
        If you did not request this, please ignore this email or contact support.
        
        Best Regards,  
        Space-X Support Team`;
        await (0, email_transporter_1.sendEmail)({
            to: user.email,
            subject: "Password Reset OTP",
            text: emailText,
        });
        res.status(200).json({
            success: true,
            message: "A password reset OTP has been sent to your email. Please check your inbox."
        });
    }
    catch (error) {
        console.log({ message: "Error sending reset OTP", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.forgotPassword = forgotPassword;
//Controller for verifying OTP
//POST /api/v1/auth/otp/verify
//@public
const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            res.status(400).json({ success: false, message: 'OTP is required' });
            return;
        }
        // const otpRecord = await OTPVerification.findOne({otp: {$exists: true}});
        // if (!otpRecord) {
        //     res.status(400).json({success: false, message: "OTP not found or already used"})
        //     return;
        // }
        const otpRecords = await OTPVerification_model_1.default.find({});
        let matchedRecord = null;
        for (const record of otpRecords) {
            const isMatch = await bcrypt_1.default.compare(otp, record.otp);
            if (isMatch) {
                matchedRecord = record;
                break;
            }
        }
        if (!matchedRecord) {
            res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
            return;
        }
        if (matchedRecord.expiresAt < new Date()) {
            await OTPVerification_model_1.default.deleteMany({ userId: matchedRecord.userId });
            res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });
            return;
        }
        const user = await user_model_1.User.findById(matchedRecord.userId);
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" });
            return;
        }
        // const validOtp = await bcrypt.compare(otp, matchedRecord.otp);
        // if (!validOtp) {
        //     res.status(400).json({ success: false, message: 'Invalid OTP' });
        //     return;
        // }
        // temp token if OTP is valid
        const tempToken = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '10m' });
        await OTPVerification_model_1.default.deleteMany({ userId: user._id });
        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can reset your password.",
            tempToken
        });
    }
    catch (error) {
        console.log({ message: "Error verifying OTP:", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.verifyOTP = verifyOTP;
//Controller for resetting password
//PUT /api/v1/auth/otp/reset
const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;
        if (!newPassword || newPassword.length < 8) {
            res.status(400).json({ success: false, message: 'New Password is required and must be at least 8 characters' });
            return;
        }
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authorization header missing or is invalid.' });
            return;
        }
        // extract temptoken from auth header
        const tempToken = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(tempToken, JWT_SECRET);
        }
        catch (err) {
            if (err.name == "TokenExpiredError") {
                res.status(401).json({
                    success: false,
                    message: "Reset token has expired. Please request for a new OTP.",
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Invalid reset token.",
            });
            return;
        }
        if (!decoded || !decoded.userId) {
            res.status(400).json({ error: "Invalid or expired reset password token" });
            return;
        }
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        user.password = await bcrypt_1.default.hash(newPassword, salt);
        user.passwordChangedAt = new Date(Date.now());
        await user.save();
        // send confirmation email
        const emailText = ` Hello ${user.name},
        Your password has been successfully changed.
        If you did not perform this action, please contact our support team immediately.
    
        Best Regards, 
        Space-X Support Team`;
        await (0, email_transporter_1.sendEmail)({
            to: user.email,
            subject: "Password Changed Successfully",
            text: emailText,
        });
        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with a new password",
        });
    }
    catch (error) {
        console.log({ message: "Error resetting password:", error: error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.resetPassword = resetPassword;
