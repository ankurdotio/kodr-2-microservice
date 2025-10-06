import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expireIn: {
        type: Date,
        required: true,
        expires: 600 // 10 minutes in seconds
    }
})

const otpModel = mongoose.model("otp", otpSchema);

export default otpModel;