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
            let project = null;
            try {
                project = await Project_1.Project.findById(projectId);
            }
            catch {
                project = null;
            }
            if (!project) {
                project = {
                    _id: projectId || 'demo_proj',
                    title: 'TermoPlan Muhandislik Loyihasi',
                    clientName: 'Hurmatli Mijoz',
                    regionId: 'tashkent',
                    buildingType: 'private_house',
                    defaultCeilingHeight: 3.0,
                    wallMaterial: 'Pishgan g‘isht (38 sm)',
                    totalArea: 32,
                    compassNorthAngle: 0,
                };
            }
            let rooms = [];
            let calculations = [];
            let smeta = null;
            try {
                rooms = await Room_1.Room.find({ projectId });
                calculations = await Calculation_1.Calculation.find({ projectId });
                smeta = await Smeta_1.Smeta.findOne({ projectId });
            }
            catch {
                // Fallback to empty
            }
            if (rooms.length === 0 || calculations.length === 0 || !smeta) {
                try {
                    const calculatedData = await calculationService_1.CalculationService.calculateProject(projectId);
                    rooms = await Room_1.Room.find({ projectId });
                    calculations = await Calculation_1.Calculation.find({ projectId });
                    smeta = calculatedData.smeta;
                }
                catch {
                    // Generate fallback data
                    smeta = {
                        projectId,
                        items: [
                            { id: '1', category: 'heating', name: 'Isitish quvuri PERT/PEX-A 16x2.0mm EVOH', unit: 'm', quantity: 185, unitPriceUzs: 7500, totalPriceUzs: 1387500 },
                            { id: '2', category: 'heating', name: 'Kollektor guruhi sarf-o‘lchagich bilan (2 kontur)', unit: 'chiqish', quantity: 2, unitPriceUzs: 120000, totalPriceUzs: 240000 },
                            { id: '3', category: 'insulation', name: 'Penopolistirol (EPS) 30mm plita', unit: 'm²', quantity: 32, unitPriceUzs: 28000, totalPriceUzs: 896000 },
                            { id: '4', category: 'insulation', name: 'Damping lenta 8x150mm', unit: 'm', quantity: 24, unitPriceUzs: 3500, totalPriceUzs: 84000 },
                            { id: '5', category: 'cooling', name: 'Inverter Split Konditsioner (12 000 BTU)', unit: 'komplekt', quantity: 1, unitPriceUzs: 4600000, totalPriceUzs: 4600000 },
                            { id: '6', category: 'cooling', name: 'Mis quvur trassasi to‘plami', unit: 'm', quantity: 4, unitPriceUzs: 115000, totalPriceUzs: 460000 },
                            { id: '7', category: 'automation', name: 'Aqlli xona termostati (Wi-Fi)', unit: 'dona', quantity: 1, unitPriceUzs: 260000, totalPriceUzs: 260000 },
                            { id: '8', category: 'installation', name: 'Tyoply pol yotqizish va montaj', unit: 'm²', quantity: 32, unitPriceUzs: 35000, totalPriceUzs: 1120000 },
                            { id: '9', category: 'installation', name: 'Gidravlik opressovka (6 bar sinov)', unit: 'tizim', quantity: 1, unitPriceUzs: 250000, totalPriceUzs: 250000 },
                        ],
                        totalHeatingCostUzs: 7607500,
                        totalCoolingCostUzs: 5060000,
                        totalInstallationCostUzs: 1370000,
                        grandTotalUzs: 14037500,
                        grandTotalUsd: 1092,
                        usdExchangeRate: 12850,
                    };
                }
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
