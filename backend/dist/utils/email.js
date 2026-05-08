"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: env_1.env.SMTP_PORT,
    secure: env_1.env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: env_1.env.SMTP_USER,
        pass: env_1.env.SMTP_PASS,
    },
});
const sendEmail = async (options) => {
    const mailOptions = {
        from: `"FinNewt Support" <${env_1.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Sent] To: ${options.to}, MessageID: ${info.messageId}`);
    }
    catch (error) {
        console.warn(`[Email Failed] To: ${options.to}, Subject: ${options.subject}`);
        console.warn(`[Email Content]: ${options.text}`);
        console.error('Email error details:', error);
    }
};
exports.sendEmail = sendEmail;
