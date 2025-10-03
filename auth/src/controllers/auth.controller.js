import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishMessage } from "../broker/rabbit.js";

export const registerUser = async function (req, res) {

    const { username, email, fullName: { firstName, lastName }, password } = req.body;

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
        }
    })

    const token = jwt.sign({
        id: user._id,
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
    }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token)

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




