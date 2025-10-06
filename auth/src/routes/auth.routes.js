import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as validationMiddleware from '../middlewares/validation.middleware.js';
import passport from 'passport';

const router = express.Router();


router.post("/register", validationMiddleware.registerValidationRules, authController.registerUser)


router.get("/google",
    passport.authenticate('google', { scope: [ 'profile', 'email' ] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleAuthCallback
);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", validationMiddleware.resetPasswordValidationRules, authController.verifyForgotPasswordOtp);

export default router;