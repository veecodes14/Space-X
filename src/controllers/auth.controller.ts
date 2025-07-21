import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from '../models/user.model';
import generateOTP from '../utils/OTP';
import OTPVerification from '../models/OTPVerification.model';
import {CustomJwtPayload} from '../types/auth.request';
import {sendEmail} from '../utils/email.transporter';

require('dotenv').config();

// JWT
const { JWT_SECRET } = process.env

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
}

//@route POST /api/v1/auth/register
//@desc Sign Up User (Create User and Hash Password)
//@access Public
export const register = async (req: Request, res: Response):Promise<void> => {
    try {
        const { name, gender, role, email, phone, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({email})

        if (existingUser) {
            res.status(404).json({
                success: false,
                message: "User already exists"
            })
        }

        const newUser = new User({name, gender, email, role, phone, password: hashedPassword })

        await newUser.save();
        res.status(201).json({message: `User, ${name} registered`})

    } catch (error: any) {
        console.log({message: "Error signing up user", error: error});
        res.status(500).json({
            success: false, 
            error: "Internal Server Error"
        })
    }
}

//@route POST /api/v1/auth/login
//@desc Login User (Login User and Generate JWT)
//@access Public

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
            return
        }

        const existingUser = await User.findOne({email}).select('+password');
        if (!existingUser) {
            res.status(400).json({
                success: false,
                message: "User not found. Please sign up."
            })
            return
        }

        const token = jwt.sign(
            {id: existingUser?._id, role: existingUser?.role},
            process.env.JWT_SECRET!,
            {expiresIn: "1h"}
        )

        const UserWithoutPassword = existingUser.toObject() as any;
        delete UserWithoutPassword.password

        res.status(200).json({
            success: true,
            message: "Passenger logged in successfully",
            token,
            data: UserWithoutPassword
        })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong"})
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email} = req.body;
        if (!email) {
            res.status(400).json({ 
                success: false,
                message: 'Email is required to reset your password'
            })
            return
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(200).json({ 
                success: true,
                message: "OTP sent if user exixts"
            })
             return
        }

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // save otp to db
        await new OTPVerification({
            userId: user._id,
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000,
        }).save();

        // email html content
        const emailText = 
        ` Hello ${user.name},
        You have requested to reset your password.
        Use the OTP below to proceed:
        OTP: ${otp}

        ------------------------
        
        Note: This OTP will expire in 10 minutes.
        If you did not request this, please ignore this email or contact support.
        
        Best Regards,  
        Space-X Support Team`;

        await sendEmail({
            email: user.email,
            subject: "Password Reset OTP",
            text: emailText,
        });

        res.status(200).json({
            success: true,
            message: "A password reset OTP has been sent to your email. Please check your inbox."
        }); 
        
    } catch (error: unknown) {
        console.log({message: "Error sending reset OTP", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}

//Controller for verifying OTP
//POST /api/v1/auth/otp/verify
//@public

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp } = req.body;
        if (!otp) {
            res.status(400).json({ success: false, message: 'OTP is required'});
            return
        }

        const otpRecord = await OTPVerification.findOne({otp: {$exists: true}});
        if (!otpRecord) {
            res.status(400).json({success: false, message: "OTP not found or already used"})
            return;
        }

        if (otpRecord.expiresAt.getTime() < Date.now()) {
            await OTPVerification.deleteMany({ userId: otpRecord.userId });
            res.status(400).json({success: false, message: "OTP has expired. Request a new one."})
            return;
        }
        
        const user = await User.findById(otpRecord.userId);
        if (!user) {
            res.status(400).json({success: false, message: "User not found"});
            return
        }

        const validOtp = await bcrypt.compare(otp, otpRecord.otp);
        if (!validOtp) {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
            return;
        }

        // temp token if OTP is valid

        const tempToken = jwt.sign({
            userId: user._id,
        }, JWT_SECRET as string, {expiresIn: '10m'})

        await OTPVerification.deleteMany({userId: user._id})

        res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can reset your password.",
            tempToken
        });
        
    } catch (error: unknown) {
        console.log({message: "Error verifying OTP:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"})
        return
    }
}

//Controller for resetting password
//PUT /api/v1/auth/otp/reset

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;

        if (!newPassword || newPassword.length < 8 ) {
            res.status(400).json({ success: false, message: 'New Password is required and must be at least 8 characters'});
            return
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({success: false, message: 'New Password is required and must be at least 8 characters' })
            return;
        }

        // extract temptoken from auth header
        const tempToken = authHeader.split(" ")[1];

        let decoded: CustomJwtPayload;

        try {
            decoded = jwt.verify(tempToken, JWT_SECRET) as CustomJwtPayload;
        } catch (err: any) {
            if (err.name == "TokenExpiredError") {
                res.status(401).json({
                    success: false,
                    message: "Reset token has expired. Please request for a neq OTP.",
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Invalid reset token.",
            })
            return;
        }

        if (!decoded || !decoded.userId) {
            res.status(400).json({ error: "Invalid or expired reset password token"})
            return;
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordChangedAt = new Date(Date.now());
        await user.save();

        // send confirmation email

        const emailText =
        ` Hello ${user.name},
        Your password has been successfully changed.
        If you did not perform this action, please contact our support team immediately.
    
        Best Regards, 
        Space-X Support Team`;

        await sendEmail({
            email: user.email,
            subject: "Password Changed Successfully",
            text: emailText,
        });

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with a new password",

        })

    } catch (error: unknown) {
        console.log({message: "Error resetting password:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}

