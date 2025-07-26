import { Request, Response, NextFunction } from "express";

//RBAC middleware for Roles: User &&  Admin
interface AuthRequest extends Request {
    user?: { role?: string };
}

export const authorizedRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {

        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No user found. Please login"
            });
            return;
        }

        const role = req.user?.role


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
    }
}    