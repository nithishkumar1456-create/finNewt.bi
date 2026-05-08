import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { prisma } from '../database/prisma';

export const exportCSV = catchAsync(async (req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: (req as any).user!.id },
    orderBy: { date: 'desc' },
  });

  const header = 'Date,Type,Category,Amount,Note,PaymentMethod\n';
  const rows = transactions.map(t => 
    `${t.date.toISOString().split('T')[0]},${t.type},${t.category},${t.amount},${t.note || ''},${t.paymentMethod || ''}`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
  res.status(200).send(header + rows);
});

export const exportPDF = catchAsync(async (req: Request, res: Response) => {
  // In a real production app, we would use pdfkit or puppeteer here.
  // This is a placeholder structure returning JSON instead.
  
  const transactions = await prisma.transaction.findMany({
    where: { userId: (req as any).user!.id },
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