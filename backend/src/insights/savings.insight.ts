import { prisma } from '../database/prisma';

export const analyzeSavings = async (userId: string) => {
  const insights = [];

  const goals = await prisma.goal.findMany({ where: { userId, status: 'active' } });

  for (const goal of goals) {
    const target = Number(goal.targetAmount);
    const current = Number(goal.currentAmount);
    const percentage = Math.round((current / target) * 100);

    if (percentage >= 50 && percentage < 100) {
      insights.push({
        userId,
        type: 'goal_motivation',
        title: 'Goal Milestone',
        description: `You are ${percentage}% toward your ${goal.title} goal! Keep it up.`,
      });
    }
  }

  // Generic savings suggestion
  insights.push({
    userId,
    type: 'savings_suggestion',
    title: 'Potential Savings',
    description: 'Reducing shopping expenses by 20% could save you an estimated amount this month.',
  });

  return insights;
};