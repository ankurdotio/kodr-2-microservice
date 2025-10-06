import sendEmail from "../utils/email.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


export async function sendForgotPasswordEmail(req, res) {

    const token = req.headers.authorization?.split(" ")[ 1 ];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const { email, otp } = decoded;

        const template = `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Use the OTP below to reset it. This OTP is valid for 10 minutes.</p>
        <h2>${otp}</h2>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br/>The Team</p>
        `;

        await sendEmail(email, "Password Reset Request", "Use the OTP below to reset your password.", template);

        res.status(200).json({ message: "If the email is registered, a OTP will be sent." });

    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Invalid or expired token" });
    }

}