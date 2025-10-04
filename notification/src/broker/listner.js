import { subscribeQueue } from "./rabbit.js";
import sendEmail from "../utils/email.js";

export default () => {

    subscribeQueue("AUTHENTICATION_NOTIFICATION_USER.REGISTERED", async (message) => {
        console.log(message)
        const template = `
        <h1>Welcome to our platform, ${message.fullName}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
        <p>Your username is: <strong>${message.username}</strong></p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br/>The Team</p>
        `;
        await sendEmail(message.email, "Welcome to Our Platform!", "Thank you for registering with us.", template)
    })

}