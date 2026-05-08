import { prisma } from '../database/prisma';
import { analyzeBudget } from './budget.insight';
import { analyzeTrends } from './trends.insight';
import { analyzeSavings } from './savings.insight';
import { analyzeHabits } from './habits.insight';

export const generateSmartInsights = async (userId: string) => {
  // Run all analyzers
  const [budgetInsights, trendInsights, savingsInsights, habitInsights] = await Promise.all([
    analyzeBudget(userId),
    analyzeTrends(userId),
    analyzeSavings(userId),
    analyzeHabits(userId),
  ]);

  const allInsights = [...budgetInsights, ...trendInsights, ...savingsInsights, ...habitInsights];

  // Store in DB for user to see
  if (allInsights.length > 0) {
    await prisma.insight.createMany({
      data: allInsights.map(i => ({
        userId: i.userId,
        type: i.type,
        title: i.title,
        description: i.description,
      })),
      skipDuplicates: true,
    });
  }

  // Fetch the latest active insights from DB
  return await prisma.insight.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
};

export { calculateHealthScore } from './score.insight';