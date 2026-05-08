import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh', authController.refresh);

router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;