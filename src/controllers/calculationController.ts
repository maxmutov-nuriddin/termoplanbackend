import { Response } from 'express';
import { CalculationService } from '../services/calculationService';
import { Calculation } from '../models/Calculation';
import { AuthRequest } from '../middleware/authMiddleware';

export class CalculationController {
  public static async calculateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
      const result = await CalculationService.calculateProject(projectId);

      res.status(200).json({
        success: true,
        message: 'Loyiha bo‘yicha qishki va yozgi mikroiqlim hisob-kitoblari muvaffaqiyatli amalga oshirildi',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getProjectCalculations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
      const calculations = await Calculation.find({ projectId }).populate('roomId');

      res.status(200).json({
        success: true,
        count: calculations.length,
        calculations,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
