import mongoose from "mongoose";
import config from "../config/config.js";




async function connectDB() {

    try {

        await mongoose.connect(config.MONGO_URI);

        console.log("DB connected successfully");

    } catch (err) {

        console.log("Error in DB connection", err);

    }

}


export default connectDB;