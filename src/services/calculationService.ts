import { Project, IProject } from '../models/Project';
import { Room, IRoom } from '../models/Room';
import { Calculation, ICalculation } from '../models/Calculation';
import { Smeta, ISmeta } from '../models/Smeta';
import { calculateRoomHeating, HeatingCalculationResult } from '../algorithms/heatingEngine';
import { calculateRoomCooling, CoolingCalculationResult } from '../algorithms/coolingEngine';
import { generateSmetaForProject } from './smetaService';

export interface FullProjectCalculationResult {
  projectId: string;
  project: IProject;
  roomsCalculations: Array<{
    roomId: string;
    room: IRoom;
    heating: HeatingCalculationResult;
    cooling: CoolingCalculationResult;
    calculationDoc?: ICalculation;
  }>;
  smeta: ISmeta | any;
}

export class CalculationService {
  /**
   * Loyihaning barcha xonalari bo'yicha to'liq isitish, sovutish va smetani hisoblash
   */
  public static async calculateProject(projectId: string): Promise<FullProjectCalculationResult> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error(`Loyiha topilmadi: ${projectId}`);
    }

    const rooms = await Room.find({ projectId });
    if (!rooms || rooms.length === 0) {
      // Agar xonalar hali kiritilmagan bo'lsa, default namuna xona yaratamiz
      const sampleRoom = new Room({
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
      project.rooms.push(sampleRoom._id as any);
      await project.save();
    }

    const roomsCalculations: FullProjectCalculationResult['roomsCalculations'] = [];
    const smetaInputRooms: any[] = [];

    for (const room of rooms) {
      const heating = calculateRoomHeating(room, project);
      const cooling = calculateRoomCooling(room, project);

      // Ma'lumotlar bazasiga saqlash yoki yangilash
      let calcDoc = await Calculation.findOne({ projectId, roomId: room._id });
      if (!calcDoc) {
        calcDoc = new Calculation({
          projectId,
          roomId: room._id,
          heating,
          cooling,
          insolation: heating.insolation,
        });
      } else {
        calcDoc.heating = heating as any;
        calcDoc.cooling = cooling as any;
        calcDoc.insolation = heating.insolation as any;
      }
      await calcDoc.save();

      roomsCalculations.push({
        roomId: (room._id as any).toString(),
        room,
        heating,
        cooling,
        calculationDoc: calcDoc,
      });

      smetaInputRooms.push({
        roomId: (room._id as any).toString(),
        roomName: room.name,
        area: room.area,
        heating,
        cooling,
      });
    }

    // Birlashgan smetani generatsiya qilish
    const smetaData = generateSmetaForProject(projectId, smetaInputRooms);
    let smetaDoc = await Smeta.findOne({ projectId });
    if (!smetaDoc) {
      smetaDoc = new Smeta(smetaData);
    } else {
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
