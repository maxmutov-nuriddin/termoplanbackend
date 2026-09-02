import { Response } from 'express';
import { Project } from '../models/Project';
import { Room } from '../models/Room';
import { Calculation } from '../models/Calculation';
import { Smeta } from '../models/Smeta';
import { CalculationService } from '../services/calculationService';
import { generateProjectPdfBuffer } from '../services/pdfService';
import { AuthRequest } from '../middleware/authMiddleware';

export class PdfController {
  public static async exportProjectPdf(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
        return;
      }

      let rooms = await Room.find({ projectId });
      let calculations = await Calculation.find({ projectId });
      let smeta = await Smeta.findOne({ projectId });

      if (rooms.length === 0 || calculations.length === 0 || !smeta) {
        const calculatedData = await CalculationService.calculateProject(projectId);
        rooms = await Room.find({ projectId });
        calculations = await Calculation.find({ projectId });
        smeta = calculatedData.smeta;
      }

      const roomsPayload = rooms.map(r => {
        const calc = calculations.find(c => (c.roomId as any)?.toString() === (r._id as any).toString());
        return {
          room: r,
          heating: calc?.heating || {} as any,
          cooling: calc?.cooling || {} as any,
        };
      });

      const pdfBuffer = await generateProjectPdfBuffer({
        project,
        rooms: roomsPayload,
        smeta,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="termoplan_loyiha_${projectId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (err: any) {
      console.error('[PdfController Error]', err);
      res.status(500).json({ success: false, message: `PDF generatsiya xatosi: ${err.message}` });
    }
  }
}
