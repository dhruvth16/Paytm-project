import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    firstname: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    }
})

export const userModel = mongoose.model('User', userSchema)