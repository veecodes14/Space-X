"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Function to generate a secure 4-digit OTP
const generateOTP = () => {
    return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
};
exports.default = generateOTP;
