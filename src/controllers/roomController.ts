import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { Project } from '../models/Project';
import { Calculation } from '../models/Calculation';
import { AuthRequest } from '../middleware/authMiddleware';

export class RoomController {
  public static async createRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
        return;
      }

      const roomData = req.body;
      const room = new Room({
        ...roomData,
        projectId,
        ceilingHeight: roomData.ceilingHeight || project.defaultCeilingHeight || 3.0,
      });
      await room.save();

      project.rooms.push(room._id as any);
      project.totalArea = (project.totalArea || 0) + (room.area || 0);
      await project.save();

      res.status(201).json({
        success: true,
        message: 'Xona muvaffaqiyatli yaratildi',
        room,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const room = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
      if (!room) {
        res.status(404).json({ success: false, message: 'Xona topilmadi' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Xona geometriyasi va parametrlari yangilandi',
        room,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getRoomById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      if (!room) {
        res.status(404).json({ success: false, message: 'Xona topilmadi' });
        return;
      }

      const calculation = await Calculation.findOne({ roomId });

      res.status(200).json({
        success: true,
        room,
        calculation,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async deleteRoom(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const room = await Room.findByIdAndDelete(roomId);
      if (!room) {
        res.status(404).json({ success: false, message: 'Xona topilmadi' });
        return;
      }

      await Project.findByIdAndUpdate(room.projectId, {
        $pull: { rooms: room._id },
      });
      await Calculation.deleteMany({ roomId });

      res.status(200).json({
        success: true,
        message: 'Xona o‘chirildi',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
