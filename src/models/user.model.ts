import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types/auth.request";



export interface IUser extends Document {
    name: string;
    gender: string;
    username: string;
    email: string;
    phone: number;
    password: string;
    role: UserRole;
    passwordChangedAt?: Date;
    isAccountDeleted: boolean;
    createdAt: Date;
}


const UserSchema: Schema = new Schema<IUser>({
    name: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true, unique: true},
    password: { type: String, required: true, unique: true, select: false},
    role:{type: String, enum: ['admin', 'user'], default: 'user'},
    passwordChangedAt:{type: Date},
    isAccountDeleted: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
})


export const User = mongoose.model<IUser>('User', UserSchema);