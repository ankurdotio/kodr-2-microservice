import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/send-forgot-password-otp', notificationController.sendForgotPasswordEmail)

export default router;