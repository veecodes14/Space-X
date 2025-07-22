import express from "express";
const router = express.Router();
import {register, login, forgotPassword, verifyOTP, resetPassword} from "../controllers/auth.controller";
import { otpRequestLimiter, otpVerifyLimiter } from '../middlewares/otpLimiter.middleware'


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign Up User
 *     description: Creates a new user account with a hashed password. If the email already exists and the account was deleted, it restores the account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - userName
 *               - studentStatus
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       200:
 *         description: Account restored successfully
 *       400:
 *         description: Bad Request - missing fields or user already exists
 *       500:
 *         description: Internal Server Error
 */
//@route POST /api/v1/auth/register
//@desc Creates a new user
//@access public
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log In User
 *     description: Authenticates a user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: User profile (excluding password)
 *       400:
 *         description: Invalid credentials or missing fields
 *       404:
 *         description: Account has been deleted
 *       500:
 *         description: Internal Server Error
 */
//@route POST /api/v1/auth/login
//@desc Login a user
//@access public
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request OTP for Password Reset
 *     description: Sends a 4-digit OTP to the user's registered email if the email exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *     responses:
 *       200:
 *         description: OTP sent (if user exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Email not provided
 *       500:
 *         description: Internal Server Error
 */
//@route POST /api/v1/auth/forgot-password
//@desc reset password when not logged in
//@access public
router.post('/forgot-password', otpRequestLimiter, forgotPassword)

/**
 * @swagger
 * /api/v1/auth/otp/verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP Code
 *     description: Verifies the 4-digit OTP code sent to the user's email and returns a temporary token for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified, temp token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 tempToken:
 *                   type: string
 *                   description: Token to use in Authorization header for resetting password
 *       400:
 *         description: Invalid or missing OTP
 *       401:
 *         description: Expired OTP
 *       500:
 *         description: Internal Server Error
 */
//@route POST /api/v1/auth/otp/verify
//@desc Verify Forgot Password OTP
//@access public
router.post('/otp/verify', otpVerifyLimiter, verifyOTP)

/**
 * @swagger
 * /api/v1/auth/otp/reset:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Reset Password using Verified OTP
 *     description: Allows the user to reset their password using the temporary token issued after successful OTP verification.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or missing token or password
 *       401:
 *         description: Token expired or unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
//@route PUT /api/v1/auth/otp/reset
//@desc Reset password
//@access public
router.put('/otp/reset', resetPassword)


export default router;



// import express from "express";
// import { register } from "../controllers/auth.controller";

// const router = express.Router()

// router.post("/register", register)

// export default router