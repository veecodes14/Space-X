"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// send email with transporter
const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        await transporter.verify();
        console.log('SMTP Connection Successful');
        const mailOptions = {
            from: `"Space-X Support Team" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error("Email Error:", error);
        throw new Error(`Error sending mail: ${error.message || error}`);
    }
};
exports.sendEmail = sendEmail;
