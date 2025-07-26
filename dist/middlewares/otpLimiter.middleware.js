"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpVerifyLimiter = exports.otpRequestLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.otpRequestLimiter = (0, express_rate_limit_1.default)({
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
exports.otpVerifyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 2, // Limit OTP verification attempts
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again in 10 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
