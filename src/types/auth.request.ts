import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    }
}

export interface CustomJwtPayload extends JwtPayload {
    id: string;
    role?: string;
    iat?: number;
    exp?: number;
}

export type UserRole = 'admin' | 'user';