"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        if (!process.env.CONNECTION_STRING) {
            console.error('MongoDB URI not found');
            process.exit(1);
        }
        await mongoose_1.default.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000
        });
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}
exports.default = connectDB;
