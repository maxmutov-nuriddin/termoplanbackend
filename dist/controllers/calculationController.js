"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationController = void 0;
const calculationService_1 = require("../services/calculationService");
const Calculation_1 = require("../models/Calculation");
class CalculationController {
    static async calculateProject(req, res) {
        try {
            const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
            const result = await calculationService_1.CalculationService.calculateProject(projectId);
            res.status(200).json({
                success: true,
                message: 'Loyiha bo‘yicha qishki va yozgi mikroiqlim hisob-kitoblari muvaffaqiyatli amalga oshirildi',
                data: result,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getProjectCalculations(req, res) {
        try {
            const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
            const calculations = await Calculation_1.Calculation.find({ projectId }).populate('roomId');
            res.status(200).json({
                success: true,
                count: calculations.length,
                calculations,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.CalculationController = CalculationController;
