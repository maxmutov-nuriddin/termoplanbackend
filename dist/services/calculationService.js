"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationService = void 0;
const Project_1 = require("../models/Project");
const Room_1 = require("../models/Room");
const Calculation_1 = require("../models/Calculation");
const Smeta_1 = require("../models/Smeta");
const heatingEngine_1 = require("../algorithms/heatingEngine");
const coolingEngine_1 = require("../algorithms/coolingEngine");
const smetaService_1 = require("./smetaService");
class CalculationService {
    /**
     * Loyihaning barcha xonalari bo'yicha to'liq isitish, sovutish va smetani hisoblash
     */
    static async calculateProject(projectId) {
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            throw new Error(`Loyiha topilmadi: ${projectId}`);
        }
        const rooms = await Room_1.Room.find({ projectId });
        if (!rooms || rooms.length === 0) {
            // Agar xonalar hali kiritilmagan bo'lsa, default namuna xona yaratamiz
            const sampleRoom = new Room_1.Room({
                projectId,
                name: 'Mehmonxona (Namuna)',
                roomType: 'living_room',
                area: 24,
                perimeter: 20,
                ceilingHeight: project.defaultCeilingHeight || 3.0,
                points: [
                    { x: 0, y: 0 },
                    { x: 6, y: 0 },
                    { x: 6, y: 4 },
                    { x: 0, y: 4 },
                ],
                walls: [
                    { id: 'w1', startPoint: { x: 0, y: 0 }, endPoint: { x: 6, y: 0 }, isExternal: true, orientation: 'SOUTH', length: 6 },
                    { id: 'w2', startPoint: { x: 6, y: 0 }, endPoint: { x: 6, y: 4 }, isExternal: false, orientation: 'WEST', length: 4 },
                    { id: 'w3', startPoint: { x: 6, y: 4 }, endPoint: { x: 0, y: 4 }, isExternal: false, orientation: 'NORTH', length: 6 },
                    { id: 'w4', startPoint: { x: 0, y: 4 }, endPoint: { x: 0, y: 0 }, isExternal: false, orientation: 'EAST', length: 4 },
                ],
                windows: [
                    { id: 'win1', position: { x: 2, y: 0 }, width: 2.0, height: 1.8, orientation: 'SOUTH', type: 'ordinary' },
                ],
                doors: [
                    { id: 'd1', position: { x: 0.5, y: 4 }, width: 0.9, openDirection: 'inside_right' },
                ],
                furniture: [
                    { id: 'f1', type: 'sofa', label: 'Yumshoq divan', position: { x: 2.5, y: 2.2 }, width: 2.2, height: 1.0, rotation: 0, isHeatingProhibited: true, isCoolingSensitive: true },
                ],
                manifoldPosition: { x: 0.3, y: 0.3 },
            });
            await sampleRoom.save();
            rooms.push(sampleRoom);
            project.rooms.push(sampleRoom._id);
            await project.save();
        }
        const roomsCalculations = [];
        const smetaInputRooms = [];
        for (const room of rooms) {
            const heating = (0, heatingEngine_1.calculateRoomHeating)(room, project);
            const cooling = (0, coolingEngine_1.calculateRoomCooling)(room, project);
            // Ma'lumotlar bazasiga saqlash yoki yangilash
            let calcDoc = await Calculation_1.Calculation.findOne({ projectId, roomId: room._id });
            if (!calcDoc) {
                calcDoc = new Calculation_1.Calculation({
                    projectId,
                    roomId: room._id,
                    heating,
                    cooling,
                    insolation: heating.insolation,
                });
            }
            else {
                calcDoc.heating = heating;
                calcDoc.cooling = cooling;
                calcDoc.insolation = heating.insolation;
            }
            await calcDoc.save();
            roomsCalculations.push({
                roomId: room._id.toString(),
                room,
                heating,
                cooling,
                calculationDoc: calcDoc,
            });
            smetaInputRooms.push({
                roomId: room._id.toString(),
                roomName: room.name,
                area: room.area,
                heating,
                cooling,
            });
        }
        // Birlashgan smetani generatsiya qilish
        const smetaData = (0, smetaService_1.generateSmetaForProject)(projectId, smetaInputRooms);
        let smetaDoc = await Smeta_1.Smeta.findOne({ projectId });
        if (!smetaDoc) {
            smetaDoc = new Smeta_1.Smeta(smetaData);
        }
        else {
            Object.assign(smetaDoc, smetaData);
        }
        await smetaDoc.save();
        // Loyiha statusini yangilash
        project.status = 'calculated';
        project.totalArea = rooms.reduce((sum, r) => sum + r.area, 0);
        await project.save();
        return {
            projectId,
            project,
            roomsCalculations,
            smeta: smetaDoc,
        };
    }
}
exports.CalculationService = CalculationService;
