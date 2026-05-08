"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("./email");
const env_1 = require("../config/env");
const runTest = async () => {
    console.log('Testing SMTP connection...');
    console.log(`SMTP Host: ${env_1.env.SMTP_HOST}`);
    console.log(`SMTP Port: ${env_1.env.SMTP_PORT}`);
    console.log(`SMTP User: ${env_1.env.SMTP_USER}`);
    try {
        await (0, email_1.sendEmail)({
            to: 'itest8790@gmail.com', // Sending to self for test
            subject: 'FinNewt.bi - SMTP Test',
            text: 'This is a test email to verify SMTP configuration.',
        });
        console.log('SMTP test completed. Check output above for success/failure logs.');
    }
    catch (err) {
        console.error('SMTP test failed with exception:', err);
    }
};
runTest();
