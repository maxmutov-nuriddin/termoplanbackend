"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const Room_1 = require("../models/Room");
const Project_1 = require("../models/Project");
const Calculation_1 = require("../models/Calculation");
class RoomController {
    static async createRoom(req, res) {
        try {
            const { projectId } = req.params;
            const project = await Project_1.Project.findById(projectId);
            if (!project) {
                res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
                return;
            }
            const roomData = req.body;
            const room = new Room_1.Room({
                ...roomData,
                projectId,
                ceilingHeight: roomData.ceilingHeight || project.defaultCeilingHeight || 3.0,
            });
            await room.save();
            project.rooms.push(room._id);
            project.totalArea = (project.totalArea || 0) + (room.area || 0);
            await project.save();
            res.status(201).json({
                success: true,
                message: 'Xona muvaffaqiyatli yaratildi',
                room,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async updateRoom(req, res) {
        try {
            const { roomId } = req.params;
            const room = await Room_1.Room.findByIdAndUpdate(roomId, req.body, { new: true });
            if (!room) {
                res.status(404).json({ success: false, message: 'Xona topilmadi' });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Xona geometriyasi va parametrlari yangilandi',
                room,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getRoomById(req, res) {
        try {
            const { roomId } = req.params;
            const room = await Room_1.Room.findById(roomId);
            if (!room) {
                res.status(404).json({ success: false, message: 'Xona topilmadi' });
                return;
            }
            const calculation = await Calculation_1.Calculation.findOne({ roomId });
            res.status(200).json({
                success: true,
                room,
                calculation,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async deleteRoom(req, res) {
        try {
            const { roomId } = req.params;
            const room = await Room_1.Room.findByIdAndDelete(roomId);
            if (!room) {
                res.status(404).json({ success: false, message: 'Xona topilmadi' });
                return;
            }
            await Project_1.Project.findByIdAndUpdate(room.projectId, {
                $pull: { rooms: room._id },
            });
            await Calculation_1.Calculation.deleteMany({ roomId });
            res.status(200).json({
                success: true,
                message: 'Xona o‘chirildi',
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.RoomController = RoomController;
