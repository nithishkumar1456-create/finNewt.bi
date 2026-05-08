import { Router } from 'express';
import * as goalController from '../controllers/goal.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createGoalSchema, updateGoalSchema, addFundsSchema } from '../validators/goal.validator';

const router = Router();

router.use(protect);

router.get('/', goalController.getGoals);
router.post('/', validate(createGoalSchema), goalController.createGoal);
router.put('/:id', validate(updateGoalSchema), goalController.updateGoal);
router.post('/:id/add-funds', validate(addFundsSchema), goalController.addFunds);
router.delete('/:id', goalController.deleteGoal);

export default router;