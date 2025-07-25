import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// email options interface
interface EmailOptions {
    to: string,
    // email: string;
    subject: string;
    text: string;
    
}

// send email with transporter

export const sendEmail = async ({to, subject, text}:EmailOptions): Promise<nodemailer.SentMessageInfo> => {
    try {
        const transporter = nodemailer.createTransport({
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

    } catch (error: any) {
        console.error("Email Error:", error);
        throw new Error(`Error sending mail: ${error.message || error}`);
    }

}