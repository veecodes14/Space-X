import rateLimit from 'express-rate-limit';

export const otpRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3,
    keyGenerator: (req) => req.body.email || req.ip,
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const otpVerifyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit:  2, // Limit OTP verification attempts
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again in 10 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});