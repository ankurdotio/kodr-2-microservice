import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishMessage } from "../broker/rabbit.js";
import otpModel from "../models/otp.model.js";
import axios from "axios";


export const registerUser = async function (req, res) {

    const { username, email, fullName: { firstName, lastName }, password, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ $or: [ { username }, { email } ] });

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "Username or email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        fullName: {
            firstName,
            lastName
        },
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullName: user.fullName,
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

    await publishMessage("AUTHENTICATION_NOTIFICATION_USER.REGISTERED", {
        email: user.email,
        fullName: `${user.fullName.firstName} ${user.fullName.lastName}`,
        username: user.username
    })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        }
    })

}

export const googleAuthCallback = async function (req, res) {

    const { id, emails: [ email ], name: { givenName: firstName, familyName: lastName } } = req.user;

    const username = email.value.split("@")[ 0 ] + Math.floor(Math.random() * 10000);

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { googleId: id }, { email: email.value } ]
    });

    if (isUserAlreadyExists) {
        const token = jwt.sign({
            id: isUserAlreadyExists._id,
            role: isUserAlreadyExists.role,
            fullName: isUserAlreadyExists.fullName,
        }, config.JWT_SECRET, { expiresIn: "2d" })

        res.cookie("token", token)

        return res.status(200).json({
            message: "Google authentication successful", user: {
                id: isUserAlreadyExists._id,
                username: isUserAlreadyExists.username,
                email: isUserAlreadyExists.email,
                fullName: isUserAlreadyExists.fullName
            }
        })
    }

    const user = await userModel.create({
        username,
        email: email.value,
        googleId: id,
        fullName: {
            firstName,
            lastName
        }
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        fullName: user.fullName,
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

    await publishMessage("AUTHENTICATION_NOTIFICATION_USER.REGISTERED", {
        email: user.email,
        fullName: `${user.fullName.firstName} ${user.fullName.lastName}`,
        username: user.username
    })

    res.status(201).json({
        message: "User registered successfully via Google",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        }
    })
}

export const forgotPassword = async function (req, res) {
    const { email } = req.body;

    const isUserExists = await userModel.findOne({ email });

    if (!isUserExists) {
        return res.status(200).json({ message: "If the email is registered, a OTP will be sent." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    await otpModel.create({
        otp: otpHash,
        email,
        expireIn: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    })

    try {
        const token = jwt.sign({ email, otp }, config.JWT_SECRET, { expiresIn: '10m' });

        const response = await axios.post("http://localhost:3001/api/notification/send-forgot-password-otp", {}, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return res.status(200).json({ message: "If the email is registered, a OTP will be sent." });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }

}

export const verifyForgotPasswordOtp = async function (req, res) {

    const { email, otp, newPassword } = req.body;

    const otpDoc = await otpModel.findOne({ email })

    if (!otpDoc) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otp);

    if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

    await otpModel.findOneAndDelete({ email });

    res.status(200).json({ message: "Password reset successful" });
}




