"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = exports.userData = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
require('dotenv').config;
const userData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const user = await user_model_1.User.findById(userId).select('-password -__v');
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User profile fetched",
            data: user
        });
    }
    catch (error) {
        console.log({ message: "Error fetching user data", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.userData = userData;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { name } = req.body;
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const updatedInfo = {
            name: name || user.name,
        };
        // await User.findByIdAndUpdate(userId, updatedInfo, {new: true, runValidators: true });
        const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, updatedInfo, { new: true, runValidators: true }).select('-password -__v');
        res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            data: updatedUser
        });
        return;
    }
    catch (error) {
        console.log({ message: "Error updating this user's profile", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
            return;
        }
        const user = await user_model_1.User.findById(userId).select('+password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        if (!user.password) {
            res.status(400).json({
                success: false,
                message: "User does not have a password"
            });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                message: "Invalid old password"
            });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
        // await User.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true, runValidators: true});
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });
        return;
    }
    catch (error) {
        console.log({ message: "Error changing password", error });
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
    }
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        user.isAccountDeleted = true;
        user.deletedAt = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
        return;
    }
    catch (error) {
        console.log({ message: "Error deleting account", error });
        res.status(500).json({ success: false, error: "Internal server error" });
        return;
    }
};
exports.deleteAccount = deleteAccount;
