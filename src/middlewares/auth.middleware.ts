import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthRequest, CustomJwtPayload } from '../types/auth.request';
import { emit } from 'process';


// interface AuthRequest extends Request {
//     user?: string | jwt.JwtPayload
// }

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
        ) as CustomJwtPayload;

        const user = await User.findById(decoded.id);

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

    } catch (error) {
        res.status(400).json(
            {
                success: false,
                message: "Invalid or expired token",
                error: error
            }
        )
    }
}