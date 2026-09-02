"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfController = void 0;
const Project_1 = require("../models/Project");
const Room_1 = require("../models/Room");
const Calculation_1 = require("../models/Calculation");
const Smeta_1 = require("../models/Smeta");
const calculationService_1 = require("../services/calculationService");
const pdfService_1 = require("../services/pdfService");
class PdfController {
    static async exportProjectPdf(req, res) {
        try {
            const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
            const project = await Project_1.Project.findById(projectId);
            if (!project) {
                res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
                return;
            }
            let rooms = await Room_1.Room.find({ projectId });
            let calculations = await Calculation_1.Calculation.find({ projectId });
            let smeta = await Smeta_1.Smeta.findOne({ projectId });
            if (rooms.length === 0 || calculations.length === 0 || !smeta) {
                const calculatedData = await calculationService_1.CalculationService.calculateProject(projectId);
                rooms = await Room_1.Room.find({ projectId });
                calculations = await Calculation_1.Calculation.find({ projectId });
                smeta = calculatedData.smeta;
            }
            const roomsPayload = rooms.map(r => {
                const calc = calculations.find(c => c.roomId?.toString() === r._id.toString());
                return {
                    room: r,
                    heating: calc?.heating || {},
                    cooling: calc?.cooling || {},
                };
            });
            const pdfBuffer = await (0, pdfService_1.generateProjectPdfBuffer)({
                project,
                rooms: roomsPayload,
                smeta,
            });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="termoplan_loyiha_${projectId}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.end(pdfBuffer);
        }
        catch (err) {
            console.error('[PdfController Error]', err);
            res.status(500).json({ success: false, message: `PDF generatsiya xatosi: ${err.message}` });
        }
    }
}
exports.PdfController = PdfController;
