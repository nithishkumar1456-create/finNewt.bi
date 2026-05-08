import { Router } from 'express';
import * as exportController from '../controllers/export.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/csv', exportController.exportCSV);
router.get('/pdf', exportController.exportPDF);

export default router;