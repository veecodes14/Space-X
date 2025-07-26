"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedRoles = void 0;
const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            });
            return;
        }
        const role = req.user?.role;
        if (!role) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user role found. Access denied.",
            });
            return;
        }
        if (!roles.includes(role)) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You are not allowed to access this resource"
            });
            return;
        }
        next();
    };
};
exports.authorizedRoles = authorizedRoles;
