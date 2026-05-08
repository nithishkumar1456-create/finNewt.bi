"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPDF = exports.exportCSV = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const prisma_1 = require("../database/prisma");
exports.exportCSV = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: { userId: req.user.id },
        orderBy: { date: 'desc' },
    });
    const header = 'Date,Type,Category,Amount,Note,PaymentMethod\n';
    const rows = transactions.map(t => `${t.date.toISOString().split('T')[0]},${t.type},${t.category},${t.amount},${t.note || ''},${t.paymentMethod || ''}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.status(200).send(header + rows);
});
exports.exportPDF = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // In a real production app, we would use pdfkit or puppeteer here.
    // This is a placeholder structure returning JSON instead.
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: { userId: req.user.id },
        orderBy: { date: 'desc' },
    });
    res.status(200).json({
        success: true,
        message: 'PDF export triggered (Mocked as JSON for this boilerplate)',
        data: {
            metadata: 'Charts metadata',
            summaries: 'Summaries here',
            transactionsCount: transactions.length,
        }
    });
});
