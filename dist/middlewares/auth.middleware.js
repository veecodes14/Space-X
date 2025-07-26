"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
// interface AuthRequest extends Request {
//     user?: string | jwt.JwtPayload
// }
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.User.findById(decoded.id);
        if (!user || user.isAccountDeleted) {
            res.status(403).json({
                success: false,
                message: "Forbidden: This account is no longer active"
            });
            return;
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
        // jwt.verify(token, process.env.JWT_SECRET as string, (error, user) => {
        //     if (error) {
        //         res.status(403).json({
        //             success: false,
        //             message: "Forbidden: Invalid or expired token "
        //         });
        //         return;
        //     }
        //     (req as any).user = user;
        //     next();
        // });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid or expired token",
            error: error
        });
    }
};
exports.authMiddleware = authMiddleware;
