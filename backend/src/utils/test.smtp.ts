import { sendEmail } from './email';
import { env } from '../config/env';

const runTest = async () => {
  console.log('Testing SMTP connection...');
  console.log(`SMTP Host: ${env.SMTP_HOST}`);
  console.log(`SMTP Port: ${env.SMTP_PORT}`);
  console.log(`SMTP User: ${env.SMTP_USER}`);

  try {
    await sendEmail({
      to: 'itest8790@gmail.com', // Sending to self for test
      subject: 'FinNewt.bi - SMTP Test',
      text: 'This is a test email to verify SMTP configuration.',
    });
    console.log('SMTP test completed. Check output above for success/failure logs.');
  } catch (err) {
    console.error('SMTP test failed with exception:', err);
  }
};

runTest();
