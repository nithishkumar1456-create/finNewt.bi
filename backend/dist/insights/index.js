"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHealthScore = exports.generateSmartInsights = void 0;
const prisma_1 = require("../database/prisma");
const budget_insight_1 = require("./budget.insight");
const trends_insight_1 = require("./trends.insight");
const savings_insight_1 = require("./savings.insight");
const habits_insight_1 = require("./habits.insight");
const generateSmartInsights = async (userId) => {
    // Run all analyzers
    const [budgetInsights, trendInsights, savingsInsights, habitInsights] = await Promise.all([
        (0, budget_insight_1.analyzeBudget)(userId),
        (0, trends_insight_1.analyzeTrends)(userId),
        (0, savings_insight_1.analyzeSavings)(userId),
        (0, habits_insight_1.analyzeHabits)(userId),
    ]);
    const allInsights = [...budgetInsights, ...trendInsights, ...savingsInsights, ...habitInsights];
    // Store in DB for user to see
    if (allInsights.length > 0) {
        await prisma_1.prisma.insight.createMany({
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
    return await prisma_1.prisma.insight.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });
};
exports.generateSmartInsights = generateSmartInsights;
var score_insight_1 = require("./score.insight");
Object.defineProperty(exports, "calculateHealthScore", { enumerable: true, get: function () { return score_insight_1.calculateHealthScore; } });
