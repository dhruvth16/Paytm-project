require('dotenv').config()
import mongoose from "mongoose";

export async function connectDB() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined in the environment variables");
    }
    await mongoose.connect(mongoUrl);
    console.log("mongoDB connected")
}