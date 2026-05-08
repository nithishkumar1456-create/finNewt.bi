import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTransactionSchema, updateTransactionSchema, queryTransactionSchema } from '../validators/transaction.validator';

const router = Router();

router.use(protect);

router.get('/', validate(queryTransactionSchema), transactionController.getTransactions);
router.post('/', validate(createTransactionSchema), transactionController.createTransaction);
router.put('/:id', validate(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;