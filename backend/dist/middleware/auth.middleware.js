"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({
                message: "No token, authorization denied"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                message: "JWT secret is not defined"
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            res.status(401).json({
                message: "Token is not valid"
            });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Token is not valid"
        });
    }
};
exports.authMiddleware = authMiddleware;
