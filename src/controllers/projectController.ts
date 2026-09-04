import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Room } from '../models/Room';
import { Calculation } from '../models/Calculation';
import { Smeta } from '../models/Smeta';
import { UZBEKISTAN_CLIMATE_DATA, ORIENTATION_FACTORS } from '../config/climateData';
import { AuthRequest } from '../middleware/authMiddleware';

export class ProjectController {
  public static async getClimateRegions(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      regions: Object.values(UZBEKISTAN_CLIMATE_DATA),
      orientations: ORIENTATION_FACTORS,
    });
  }

  public static async getAllProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query: any = {};
      // Support bo'lsa butun tizimdagi barcha loyihalarni ko'radi
      // Oddiy foydalanuvchi esa FAQAT o'zining loyihalarini ko'radi (bir-birinikini ko'rmaydi)
      if (req.userRole !== 'support' && req.userRole !== 'admin') {
        if (req.userId && req.userId !== 'demo_user_id') {
          query.userId = req.userId;
        } else {
          query.userId = '000000000000000000000000';
        }
      }

      const projects = await Project.find(query)
        .populate('rooms')
        .sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getProjectById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate('rooms');
      if (!project) {
        res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
        return;
      }

      if (req.userRole !== 'support' && req.userRole !== 'admin') {
        if (project.userId && project.userId.toString() !== req.userId) {
          res.status(403).json({ success: false, message: 'Ushbu loyihaga kirish huquqiga ega emassiz' });
          return;
        }
      }

      const rooms = await Room.find({ projectId: id });
      const calculations = await Calculation.find({ projectId: id });
      const smeta = await Smeta.findOne({ projectId: id });

      res.status(200).json({
        success: true,
        project,
        rooms,
        calculations,
        smeta,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        title,
        clientName,
        clientPhone,
        address,
        regionId,
        compassNorthAngle,
        buildingType,
        wallMaterial,
        insulationQuality,
        defaultCeilingHeight,
      } = req.body;

      const project = new Project({
        userId: req.userId !== 'demo_user_id' ? req.userId : undefined,
        title: title || 'Yangi Mikroiqlim Loyihasi',
        clientName,
        clientPhone,
        address,
        regionId: regionId || 'tashkent',
        compassNorthAngle: typeof compassNorthAngle === 'number' ? compassNorthAngle : 0,
        buildingType: buildingType || 'private_house',
        wallMaterial: wallMaterial || 'brick',
        insulationQuality: insulationQuality || 'standard',
        defaultCeilingHeight: defaultCeilingHeight || 3.0,
        rooms: [],
      });

      await project.save();

      res.status(201).json({
        success: true,
        message: 'Loyiha muvaffaqiyatli yaratildi',
        project,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
        return;
      }

      if (req.userRole !== 'support' && req.userRole !== 'admin') {
        if (project.userId && project.userId.toString() !== req.userId) {
          res.status(403).json({ success: false, message: 'Ushbu loyihani o‘zgartirish huquqiga ega emassiz' });
          return;
        }
      }

      Object.assign(project, req.body);
      await project.save();

      res.status(200).json({
        success: true,
        message: 'Loyiha maʼlumotlari yangilandi',
        project,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async deleteProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
        return;
      }

      if (req.userRole !== 'support' && req.userRole !== 'admin') {
        if (project.userId && project.userId.toString() !== req.userId) {
          res.status(403).json({ success: false, message: 'Ushbu loyihani o‘chirish huquqiga ega emassiz' });
          return;
        }
      }

      await Project.findByIdAndDelete(id);
      await Room.deleteMany({ projectId: id });
      await Calculation.deleteMany({ projectId: id });
      await Smeta.deleteMany({ projectId: id });

      res.status(200).json({
        success: true,
        message: 'Loyiha va unga tegishli barcha maʼlumotlar o‘chirildi',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
