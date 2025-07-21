import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function connectDB(): Promise<void> {
    try {
        if (!process.env.CONNECTION_STRING) {
            console.error('MongoDB URI not found');
            process.exit(1);
        }
        await mongoose.connect(process.env.CONNECTION_STRING as string,
        {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000
        });

        console.log('MongoDB Connected');

    } catch (error: unknown) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }

}

export default connectDB