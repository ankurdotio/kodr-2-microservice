import express from 'express';
import sendEmail from './utils/email.js';

const app = express();


sendEmail("ankur.sheryians@gmail.com", "Test Subject", "Test Text", "<p>Test HTML</p>");

export default app;