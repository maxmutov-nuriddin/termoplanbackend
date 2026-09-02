"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = require("../models/Project");
const Room_1 = require("../models/Room");
const Calculation_1 = require("../models/Calculation");
const Smeta_1 = require("../models/Smeta");
const climateData_1 = require("../config/climateData");
class ProjectController {
    static async getClimateRegions(req, res) {
        res.status(200).json({
            success: true,
            regions: Object.values(climateData_1.UZBEKISTAN_CLIMATE_DATA),
            orientations: climateData_1.ORIENTATION_FACTORS,
        });
    }
    static async getAllProjects(req, res) {
        try {
            const query = {};
            if (req.userId && req.userId !== 'demo_user_id') {
                query.userId = req.userId;
            }
            const projects = await Project_1.Project.find(query)
                .populate('rooms')
                .sort({ updatedAt: -1 });
            res.status(200).json({
                success: true,
                count: projects.length,
                projects,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.Project.findById(id).populate('rooms');
            if (!project) {
                res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
                return;
            }
            const rooms = await Room_1.Room.find({ projectId: id });
            const calculations = await Calculation_1.Calculation.find({ projectId: id });
            const smeta = await Smeta_1.Smeta.findOne({ projectId: id });
            res.status(200).json({
                success: true,
                project,
                rooms,
                calculations,
                smeta,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async createProject(req, res) {
        try {
            const { title, clientName, clientPhone, address, regionId, compassNorthAngle, buildingType, wallMaterial, insulationQuality, defaultCeilingHeight, } = req.body;
            const project = new Project_1.Project({
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
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async updateProject(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.Project.findByIdAndUpdate(id, req.body, { new: true });
            if (!project) {
                res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Loyiha maʼlumotlari yangilandi',
                project,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async deleteProject(req, res) {
        try {
            const { id } = req.params;
            await Project_1.Project.findByIdAndDelete(id);
            await Room_1.Room.deleteMany({ projectId: id });
            await Calculation_1.Calculation.deleteMany({ projectId: id });
            await Smeta_1.Smeta.deleteMany({ projectId: id });
            res.status(200).json({
                success: true,
                message: 'Loyiha va unga tegishli barcha maʼlumotlar o‘chirildi',
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.ProjectController = ProjectController;
