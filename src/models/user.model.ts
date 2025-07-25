import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types/auth.request";



export interface IUser extends Document {
    name: string;
    gender: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    passwordChangedAt?: Date;
    isAccountDeleted: boolean;
    deletedAt: Date
    // createdAt: Date;
}


const UserSchema: Schema = new Schema<IUser>({
    name: {type: String, required: true},
    gender: {type: String, required: true, enum: ['male', 'female', 'other']},
    username: { type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true, lowercase: true},
    phone: {type: String, required: true, unique: true},
    password: { type: String, required: true, select: false},
    role:{type: String, enum: ['admin', 'user'], default: 'user'},
    isVerified: {type: Boolean, default: false},
    passwordChangedAt:{type: Date},
    isAccountDeleted: {type: Boolean, default: false},
    deletedAt: { type: Date, default: null}
    // createdAt: {type: Date, default: Date.now}
},
{
    timestamps: true,
}
)


export const User = mongoose.model<IUser>('User', UserSchema);