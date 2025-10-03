import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [ true, "Username is required" ],
        unique: [ true, "Username must be unique" ],
        minlength: [ 3, "Username must be at least 3 characters long" ],
        maxlength: [ 30, "Username must be at most 30 characters long" ]
    },

    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: [ true, "Email must be unique" ],
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address" ]
    },

    fullName: {
        firstName: {
            type: String,
            required: [ true, "First name is required" ],
            minlength: [ 1, "First name must be at least 1 character long" ],
            maxlength: [ 50, "First name must be at most 50 characters long" ]
        },
        lastName: {
            type: String,
            required: [ true, "Last name is required" ],
            minlength: [ 1, "Last name must be at least 1 character long" ],
            maxlength: [ 50, "Last name must be at most 50 characters long" ]
        }
    },
    googleId: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    }
})


const userModel = mongoose.model("user", userSchema);


export default userModel;