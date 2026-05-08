"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const recurring_job_1 = require("./recurring.job");
const initCronJobs = () => {
    // Run daily at midnight
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('Running daily recurring transactions job...');
        await (0, recurring_job_1.processRecurringTransactions)();
    });
    // Example Weekly Summary Job (Sundays at 9 AM)
    node_cron_1.default.schedule('0 9 * * 0', async () => {
        console.log('Running weekly summary job...');
        // Implementation logic for weekly summaries
    });
    console.log('Cron jobs initialized.');
};
exports.initCronJobs = initCronJobs;
