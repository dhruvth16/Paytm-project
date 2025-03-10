import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export interface CustomRequest extends Request {
    userId?: string
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.header("Authorization");
    
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({
                message: "No token, authorization denied"
            })
            return;
        }
    
        const token = authHeader.split(" ")[1];
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                message: "JWT secret is not defined"
            })
            return;
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
        if (!decoded || !decoded.id) {
            res.status(401).json({
                message: "Token is not valid"
            })
            return;
        }
    
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Token is not valid"
        })
    }
}