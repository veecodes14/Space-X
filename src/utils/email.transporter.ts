import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// email options interface
interface EmailOptions {
    email: string;
    subject: string;
    text: string;
}

// send email with transporter

export const sendEmail = async ({email, subject, text}:EmailOptions): Promise<nodemailer.SentMessageInfo> => {
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
            to: email,
            subject,
            text,

        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}: ${info.messageId}`);

        return info;

    } catch (error) {
        throw new Error(`Error sending mail: ${error}`);
    }

}