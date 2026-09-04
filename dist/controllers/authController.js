"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, phone, role, company } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ success: false, message: 'Ism, email va parol kiritilishi shart' });
                return;
            }
            const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                res.status(400).json({ success: false, message: 'Bu email allaqachon ro‘yxatdan o‘tgan' });
                return;
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = new User_1.User({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                phone,
                role: role || 'user',
                company,
            });
            await user.save();
            const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '30d' });
            res.status(201).json({
                success: true,
                message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    company: user.company,
                },
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, message: 'Email va parol kiritilishi shart' });
                return;
            }
            const user = await User_1.User.findOne({ email: email.toLowerCase() });
            if (!user || !user.password) {
                res.status(401).json({ success: false, message: 'Email yoki parol noto‘g‘ri' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: 'Email yoki parol noto‘g‘ri' });
                return;
            }
            const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
            const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '30d' });
            res.status(200).json({
                success: true,
                message: 'Tizimga muvaffaqiyatli kirildi',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    company: user.company,
                },
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getProfile(req, res) {
        try {
            if (!req.userId || req.userId === 'demo_user_id') {
                res.status(200).json({
                    success: true,
                    user: {
                        id: 'demo_user_id',
                        name: 'Muhandis (Demo)',
                        email: 'engineer@termoplan.uz',
                        role: 'engineer',
                        company: 'TermoPlan Engineering',
                    },
                });
                return;
            }
            const user = await User_1.User.findById(req.userId).select('-password');
            if (!user) {
                res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
                return;
            }
            res.status(200).json({ success: true, user });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async updateProfile(req, res) {
        try {
            if (!req.userId || req.userId === 'demo_user_id') {
                const { name, phone, company } = req.body;
                res.status(200).json({
                    success: true,
                    message: 'Maʼlumotlar muvaffaqiyatli yangilandi (Demo)',
                    user: {
                        id: 'demo_user_id',
                        name: name || 'Foydalanuvchi',
                        email: 'user@termoplan.uz',
                        phone: phone || '+998 90 000-00-00',
                        role: 'user',
                        company: company || 'TermoPlan',
                    },
                });
                return;
            }
            const { name, phone, company, currentPassword, newPassword } = req.body;
            const user = await User_1.User.findById(req.userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
                return;
            }
            if (name)
                user.name = name.trim();
            if (phone !== undefined)
                user.phone = phone.trim();
            if (company !== undefined)
                user.company = company.trim();
            if (newPassword) {
                if (!currentPassword) {
                    res.status(400).json({ success: false, message: 'Parolni o‘zgartirish uchun hozirgi parolni kiriting' });
                    return;
                }
                const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password || '');
                if (!isMatch) {
                    res.status(400).json({ success: false, message: 'Hozirgi parol noto‘g‘ri kiritildi' });
                    return;
                }
                user.password = await bcryptjs_1.default.hash(newPassword, 10);
            }
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Maʼlumotlar muvaffaqiyatli yangilandi',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    company: user.company,
                },
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getAllUsers(req, res) {
        try {
            if (req.userRole !== 'support' && req.userRole !== 'admin') {
                res.status(403).json({ success: false, message: 'Faqat Support foydalanuvchilariga ruxsat berilgan' });
                return;
            }
            const users = await User_1.User.find({}).select('-password').sort({ createdAt: -1 });
            const usersWithStats = await Promise.all(users.map(async (u) => {
                const count = await Project_1.Project.countDocuments({ userId: u._id });
                return {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone || '',
                    role: u.role,
                    company: u.company || '',
                    projectsCount: count,
                    createdAt: u.createdAt,
                };
            }));
            res.status(200).json({
                success: true,
                count: usersWithStats.length,
                users: usersWithStats,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.AuthController = AuthController;
