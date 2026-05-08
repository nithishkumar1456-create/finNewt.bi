import cron from 'node-cron';
import { processRecurringTransactions } from './recurring.job';

export const initCronJobs = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily recurring transactions job...');
    await processRecurringTransactions();
  });

  // Example Weekly Summary Job (Sundays at 9 AM)
  cron.schedule('0 9 * * 0', async () => {
    console.log('Running weekly summary job...');
    // Implementation logic for weekly summaries
  });

  console.log('Cron jobs initialized.');
};