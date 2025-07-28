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
        const { name, gender, role, username, email, phone, password} = req.body

        const existingUser = await User.findOne({email})

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({name, gender, email, username, role, phone, password: hashedPassword })

        await newUser.save();
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

        // await sendEmail({
        // to: email,
        // subject: 'Verify your account',
        // text: `Hi ${name}, your OTP for registration is ${otp}. It will expire in 10 minutes.`,
        // });


        res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
            return;
        }

        const existingUser = await User.findOne({email, isAccountDeleted: false}).select('+password');
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found. Please sign up."
            })
            return
        }

        // if (!existingUser.isVerified) {
        // res.status(403).json({
        //     success: false,
        //     message: 'Please verify your email before logging in.'
        //     });
        //     return;
        // }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
            return;
        }

        const token = jwt.sign(
            {id: existingUser?._id, 
            role: existingUser?.role,
            email: existingUser.email},
            process.env.JWT_SECRET!,
            {expiresIn: "1h"}
        )

        const UserWithoutPassword = existingUser.toObject() as any;
        delete UserWithoutPassword.password

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: UserWithoutPassword
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
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
                message: "OTP sent if user exists"
            })
             return
        }

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await OTPVerification.deleteMany({ email });


        // save otp to db
        await new OTPVerification({
            userId: user._id,
            email: email,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000,
        }).save();

        const tempToken = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET as string, {expiresIn: '10m'})


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
            to: user.email,
            subject: "Password Reset OTP",
            text: emailText,
        });

        res.status(200).json({
            success: true,
            message: "A password reset OTP has been sent to your email. Please check your inbox.", 
            data: {
                tempToken,
            }
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

// export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { otp, email } = req.body;

//     if (!otp || !email) {
//       res.status(400).json({ 
//         success: false, 
//         message: 'OTP and email are required' });
//         return;
//     }

//     console.log('[DEBUG] OTP and email received:', { otp, email });

//     // Find latest OTP record for this email
//     const otpRecords = await OTPVerification.find({ email }).sort({ createdAt: -1 });

//     if (!otpRecords.length) {
//       console.log('[DEBUG] No OTP records found for email:', email);
//        res.status(400).json({ success: false, 
//         message: 'OTP not found or already used' });
//         return
//     }

//     let matchedRecord: any = null;

//     for (const record of otpRecords) {
//       const isMatch = await bcrypt.compare(otp, record.otp);
//       if (isMatch) {
//         matchedRecord = record;
//         break;
//       }
//     }

//     if (!matchedRecord) {
//       console.log('[DEBUG] No matching OTP found');
//        res.status(400).json({ success: false,
//          message: 'Invalid or expired OTP' });
//          return
//     }

//     console.log('[DEBUG] Matched OTP record:', matchedRecord);

//     if (matchedRecord.expiresAt < new Date()) {
//       console.log('[DEBUG] OTP expired at:', matchedRecord.expiresAt);
//       await OTPVerification.deleteMany({ userId: matchedRecord.userId });
//        res.status(400).json({ success: false, 
//         message: 'OTP has expired. Request a new one.' });
//         return
//     }

//     const user = await User.findById(matchedRecord.userId);
//     if (!user) {
//       console.log('[DEBUG] User not found:', matchedRecord.userId);
//        res.status(400).json({ success: false, 
//         message: 'User not found' });
//         return
//     }

//     // OTP is valid — issue temporary token
//     const tempToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '10m' }
//     );

//     await OTPVerification.deleteMany({ userId: user._id });

//     console.log('[DEBUG] OTP verified, temp token issued');
//     res.status(200).json({
//       success: true,
//       message: 'OTP verified successfully. You can reset your password.',
//       tempToken,
//     });

//   } catch (error: unknown) {
//     console.error('[ERROR] OTP verification failed:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp } = req.body;
        const authHeader = req.headers.authorization;

        if (!otp) {
            res.status(400).json({ success: false, message: 'OTP is required' });
            return;
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authorization token missing or malformed' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as { userId: string }).userId;

        const otpRecord = await OTPVerification.findOne({ userId });
        if (!otpRecord) {
            res.status(400).json({ success: false, message: 'OTP not found or already used' });
            return;
        }

        if (otpRecord.expiresAt.getTime() < Date.now()) {
            await OTPVerification.deleteMany({ userId });
            res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
            return;
        }

        const isValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
            return;
        }

        await OTPVerification.deleteMany({ userId });

        const resetToken = jwt.sign(
            { userId },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            success: true,
            message: 'OTP verified. You can now reset your password.',
            data: resetToken,
        });

    } catch (error) {
        console.log({ message: 'Error verifying OTP', error });
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};



// export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { otp} = req.body;
//         if (!otp ) {
//             res.status(400).json({ success: false, message: 'OTP is required'});
//             return
//         }

//         // const otpRecord = await OTPVerification.findOne({otp: {$exists: true}});
//         const otpRecord = await OTPVerification.findOne({ email }).sort({ createdAt: -1 });
//         if (!otpRecord) {
//             res.status(400).json({success: false, message: "OTP not found or already used"})
//             return;
//         }

//         const otpRecords = await OTPVerification.find({});

//         let matchedRecord = null;
//         for (const record of otpRecords) {
//             const isMatch = await bcrypt.compare(otp, record.otp);
//             if (isMatch) {
//                 matchedRecord = record;
//                 break;
//             }
//         }

//         if (!matchedRecord) {
//             res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//             return;
//         }


//         if (matchedRecord.expiresAt < new Date()) {
//             await OTPVerification.deleteMany({ userId: matchedRecord.userId });
//             res.status(400).json({success: false, message: "OTP has expired. Request a new one."})
//             return;
//         }
        
//         const user = await User.findById(matchedRecord.userId);
//         if (!user) {
//             res.status(400).json({success: false, message: "User not found"});
//             return
//         }

//         // const validOtp = await bcrypt.compare(otp, matchedRecord.otp);
//         // if (!validOtp) {
//         //     res.status(400).json({ success: false, message: 'Invalid OTP' });
//         //     return;
//         // }

//         // temp token if OTP is valid

//         const tempToken = jwt.sign({
//             userId: user._id,
//         }, process.env.JWT_SECRET as string, {expiresIn: '10m'})

//         await OTPVerification.deleteMany({userId: user._id})

//         res.status(200).json({
//             success: true,
//             message: "OTP verified successfully. You can reset your password.",
//             tempToken
//         });
        
//     } catch (error: unknown) {
//         console.log({message: "Error verifying OTP:", error: error});
//         res.status(500).json({success: false, error: "Internal Server Error"})
//         return
//     }
// }

//Controller for resetting password
//PUT /api/v1/auth/otp/reset

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
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

const tempToken = authHeader.split(" ")[1];
let decoded: CustomJwtPayload;

try {
    decoded = jwt.verify(tempToken, JWT_SECRET) as CustomJwtPayload;
} catch (err: any) {
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

// Hash the new password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(newPassword, salt);

// Update only password fields
const user = await User.findByIdAndUpdate(
    decoded.userId,
    {
        password: hashedPassword,
        passwordChangedAt: new Date(),
    },
    { new: true }
);

if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
}

// Send confirmation email
const emailText = ` Hello ${user.name},
Your password has been successfully changed.
If you did not perform this action, please contact our support team immediately.

Best Regards, 
Space-X Support Team`;

await sendEmail({
    to: user.email,
    subject: "Password Changed Successfully",
    text: emailText,
});

res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now login with a new password",
});
        // const { newPassword } = req.body;
        // const authHeader = req.headers.authorization;

        // if (!newPassword || newPassword.length < 8) {
        //     res.status(400).json({ success: false, message: 'New Password is required and must be at least 8 characters' });
        //     return;
        // }
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     res.status(401).json({ success: false, message: 'Unauthorized request. Please verify OTP first.' });
        //     return;
        // }

        // //Extract tempToken from the Authorization header
        // const tempToken = authHeader.split(" ")[1];

        // // const decodedToken = jwt.verify(tempToken, ACCESS_TOKEN_SECRET);
        // // const decoded = decodedToken as unknown as CustomJwtPayload;
        // let decoded: CustomJwtPayload;

        // try {
        //     decoded = jwt.verify(tempToken, JWT_SECRET) as CustomJwtPayload;
        // } catch (err: any) {
        //     if (err.name === "TokenExpiredError") {
        //         res.status(401).json({
        //             success: false,
        //             message: "Reset token has expired. Please request a new OTP.",
        //         });
        //         return;
        //     }
        //     res.status(400).json({
        //         success: false,
        //         message: "Invalid reset token.",
        //     });
        //     return;
        // }

        // if (!decoded || !decoded.userId) {
        //     res.status(400).json({ error: "Invalid or expired reset password token" });
        //     return;
        // }

        // const user = await User.findById(decoded.userId);
        // if (!user) {
        //     res.status(404).json({ error: "User not found" });
        //     return;
        // }

        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(newPassword, salt);
        // user.passwordChangedAt = new Date(Date.now());
        // await user.save();

        // //Send confirmation email
        // const emailText =
        //     ` Hello ${user.name},
        // Your password has been successfully changed.
        // If you did not perform this action, please contact our support team immediately.
    
        // Best Regards, 
        // Space-X Support Team`;


        // await sendEmail({
        //     to: user.email,
        //     subject: "✅ Password Changed Successfully Updated",
        //     text: emailText,
        // });

        // res.status(200).json({
        //     success: true,
        //     message: "Password reset successfully. You can now log in with your new password.",
        // })


    }
        catch (error: unknown) {
        console.log({message: "Error resetting password:", error: error});
        res.status(500).json({success: false, error: "Internal Server Error"});
        return
    }
}







