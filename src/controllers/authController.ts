import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone, role, company } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Ism, email va parol kiritilishi shart' });
        return;
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'Bu email allaqachon ro‘yxatdan o‘tgan' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        role: role || 'user',
        company,
      });
      await user.save();

      const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
      const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '30d' });

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
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email va parol kiritilishi shart' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.password) {
        res.status(401).json({ success: false, message: 'Email yoki parol noto‘g‘ri' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Email yoki parol noto‘g‘ri' });
        return;
      }

      const secret = process.env.JWT_SECRET || 'termoplan_super_secret_jwt_key_2026';
      const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '30d' });

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
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getProfile(req: AuthRequest, res: Response): Promise<void> {
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

      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
        return;
      }

      res.status(200).json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
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
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
        return;
      }

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (company !== undefined) user.company = company.trim();

      if (newPassword) {
        if (!currentPassword) {
          res.status(400).json({ success: false, message: 'Parolni o‘zgartirish uchun hozirgi parolni kiriting' });
          return;
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password || '');
        if (!isMatch) {
          res.status(400).json({ success: false, message: 'Hozirgi parol noto‘g‘ri kiritildi' });
          return;
        }
        user.password = await bcrypt.hash(newPassword, 10);
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
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
