import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/summary', analyticsController.getSummary);
router.get('/trends', analyticsController.getTrends);
router.get('/categories', analyticsController.getCategories);
router.get('/insights', analyticsController.getInsights);
router.get('/score', analyticsController.getHealthScore);

export default router;
