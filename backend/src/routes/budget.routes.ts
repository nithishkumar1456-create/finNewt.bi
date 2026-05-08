import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator';

const router = Router();

router.use(protect);

router.get('/', budgetController.getBudgets);
router.post('/', validate(createBudgetSchema), budgetController.createBudget);
router.put('/:id', validate(updateBudgetSchema), budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

export default router;