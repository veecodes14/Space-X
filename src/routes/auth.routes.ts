import express from "express";
const router = express.Router();
import {register, login, forgotPassword, verifyOTP, resetPassword} from "../controllers/auth.controller";
import { validateRegistration, validateLogin } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validate.request";
import { otpRequestLimiter, otpVerifyLimiter } from '../middlewares/otpLimiter.middleware'


/**
 * @swagger
 * /auth/register:
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
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
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
 * /auth/login:
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
 *       400:
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
 * /auth/forgot-password:
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
 *       400:
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
 * /auth/otp/verify:
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
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
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
 * /auth/otp/reset:
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
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or password reset failed
 */
/** 
//@route PUT /api/v1/auth/otp/reset
//@desc Reset password
//@access public
*/
router.put('/otp/reset', resetPassword)

/**
 * @swagger
 * /api/v1/ping:
 *   get:
 *     summary: Test route
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Pong
 */
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});


export default router;



// import express from "express";
// import { register } from "../controllers/auth.controller";

// const router = express.Router()

// router.post("/register", register)

// export default router