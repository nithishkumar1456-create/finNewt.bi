import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  const mailOptions = {
    from: `"FinNewt Support" <${env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] To: ${options.to}, MessageID: ${info.messageId}`);
  } catch (error) {
    console.warn(`[Email Failed] To: ${options.to}, Subject: ${options.subject}`);
    console.warn(`[Email Content]: ${options.text}`);
    console.error('Email error details:', error);
  }
};