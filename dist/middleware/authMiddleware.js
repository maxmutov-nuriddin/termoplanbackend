"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Agar token bo'lmasa, demo/guest rejimi uchun davom etishga ruxsat beramiz
        req.userId = 'demo_user_id';
        req.userRole = 'engineer';
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: 'Yaroqsiz yoki eskirgan avtorizatsiya tokeni' });
    }
};
exports.authMiddleware = authMiddleware;
