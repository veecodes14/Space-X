import express from "express";
const router = express.Router();
import {register, login, forgotPassword, verifyOTP, resetPassword} from "../controllers/auth.controller";
import { validateRegistration, validateLogin } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validate.request";
import { otpRequestLimiter, otpVerifyLimiter } from '../middlewares/otpLimiter.middleware'


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - role
 *               - username
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: female
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Validation error
 */
/** 
//@route POST /api/v1/auth/register
//@desc Creates a new user
//@access public
*/
router.post('/register', validateRegistration, validateRequest, register);



/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
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
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       500:
 *         description: Invalid credentials
 */
/** 
//@route POST /api/v1/auth/login
//@desc Login a user
//@access public
*/
router.post('/login', validateLogin, validateRequest, login);


/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request OTP to reset password
 *     tags: [Auth]
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
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent to user's email
 *       500:
 *         description: Email not found or validation error
 */
/** 
//@route POST /api/v1/auth/forgot-password
//@desc reset password when not logged in
//@access public
*/
router.post('/forgot-password', otpRequestLimiter, forgotPassword)

/**
 * @swagger
 * /api/v1/auth/otp/verify:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
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
 *         description: OTP verified successfully
 *       500:
 *         description: Invalid or expired OTP
 */
/** 
//@route POST /api/v1/auth/otp/verify
//@desc Verify Forgot Password OTP
//@access public
*/
router.post('/otp/verify', otpVerifyLimiter, verifyOTP)

/**
 * @swagger
 * /api/v1/auth/otp/reset:
 *   put:
 *     summary: Reset password using verified OTP
 *     tags: [Auth]
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
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *       500:
 *         description: Invalid OTP or password reset failed
 */
/** 
//@route PUT /api/v1/auth/otp/reset
//@desc Reset password
//@access public
*/
router.put('/otp/reset', resetPassword)


export default router;



// import express from "express";
// import { register } from "../controllers/auth.controller";

// const router = express.Router()

// router.post("/register", register)

// export default router