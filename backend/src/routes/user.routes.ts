import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validator';

const router = Router();

router.use(protect); // All user routes require authentication

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/change-password', validate(changePasswordSchema), userController.changePassword);

export default router;