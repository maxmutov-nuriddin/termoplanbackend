"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRoomHeating = calculateRoomHeating;
const climateData_1 = require("../config/climateData");
const constants_1 = require("../config/constants");
const insolationCalculator_1 = require("./insolationCalculator");
const routePlanner_1 = require("./routePlanner");
function calculateRoomHeating(room, project) {
    const region = climateData_1.UZBEKISTAN_CLIMATE_DATA[project.regionId] || climateData_1.UZBEKISTAN_CLIMATE_DATA['tashkent'];
    const minWinterTemp = region.minWinterTemp;
    const targetIndoorTemp = 22; // Komfort ichki harorat (°C)
    const deltaT = targetIndoorTemp - minWinterTemp; // Haroratlar farqi (masalan, 22 - (-15) = 37°C)
    const area = room.area || 20;
    const perimeter = room.perimeter || Math.round(Math.sqrt(area) * 4);
    const ceilingHeight = room.ceilingHeight || project.defaultCeilingHeight || 3.0;
    const volume = area * ceilingHeight;
    // Insolyatsiya tahlili
    const insolation = (0, insolationCalculator_1.analyzeInsolation)(project.regionId, project.compassNorthAngle || 0, room.walls || [], room.windows || []);
    // Devor va oynalardan issiqlik yo'qotilishi hisobi
    const wallThermalFactor = project.wallMaterial === 'aerated_concrete' ? 0.35 : project.wallMaterial === 'brick' ? 0.55 : 0.70;
    const insulationFactor = project.insulationQuality === 'high' ? 0.8 : project.insulationQuality === 'poor' ? 1.3 : 1.0;
    // Bazaviy solishtirma issiqlik yo'qotilishi (W/m²)
    const specificLossWM2 = Math.round(constants_1.HEATING_CONSTANTS.BASE_HEAT_LOSS_W_M2 * wallThermalFactor * insulationFactor * insolation.heatingMultiplier);
    const totalHeatLossW = Math.round(specificLossWM2 * area);
    // Oyna va tashqi devorlar bo'ylab sovuq chegara zonasini hisoblash
    const windowCount = (room.windows && room.windows.length) || 1;
    const totalWindowWidth = room.windows?.reduce((acc, w) => acc + (w.width || 1.4), 0) || 1.4;
    const coldZoneArea = Math.min(area * 0.35, parseFloat((totalWindowWidth * 1.5 + (perimeter * 0.25)).toFixed(1)));
    const comfortZoneArea = Math.max(0, area - coldZoneArea);
    const isSunny = insolation.solarFactor >= 1.20;
    const shagZones = [
        {
            zone: 'cold_boundary',
            stepCm: 10,
            areaM2: coldZoneArea,
            description: 'Oyna osti va tashqi devor bo‘ylab sovuq tushishni kesuvchi zich chegara zonasi (10 sm).',
        },
        {
            zone: isSunny ? 'sunny_living' : 'comfort_living',
            stepCm: isSunny ? 20 : 15,
            areaM2: parseFloat((comfortZoneArea).toFixed(1)),
            description: isSunny
                ? 'Quyosh nuri faol tushadigan markaziy hudud (20 sm qadam, ortiqcha qizib ketmaslik uchun).'
                : 'Asosiy qulay yashash hududi (15 sm standart optimal qadam).',
        },
    ];
    // Xona o'lchamlari (to'rtburchak taxminiy kenglik/bo'y yoki nuqtalardan)
    let roomWidthM = Math.sqrt(area * 1.2);
    let roomHeightM = area / roomWidthM;
    if (room.points && room.points.length >= 3) {
        const xs = room.points.map((p) => p.x);
        const ys = room.points.map((p) => p.y);
        roomWidthM = Math.max(2, Math.max(...xs) - Math.min(...xs));
        roomHeightM = Math.max(2, Math.max(...ys) - Math.min(...ys));
    }
    const manifoldPos = room.manifoldPosition || { x: 0.3, y: 0.3 };
    // 2D Quvurlar marshruti (Spiral / Salyangoz)
    const circuits = (0, routePlanner_1.generateUnderfloorPipeRoutes)(roomWidthM, roomHeightM, constants_1.HEATING_CONSTANTS.STEP_COLD_ZONE, constants_1.HEATING_CONSTANTS.STEP_COMFORT_ZONE, constants_1.HEATING_CONSTANTS.STEP_SUNNY_ZONE, manifoldPos, room.furniture || [], isSunny);
    const rawPipeLength = circuits.reduce((sum, c) => sum + c.lengthM, 0);
    // Formula bo'yicha quvur solishtirish (S / step):
    const formulaLength = Math.round((coldZoneArea / 0.10) + (comfortZoneArea / (isSunny ? 0.20 : 0.15)));
    const finalPipeLength = Math.max(Math.round(rawPipeLength), formulaLength);
    const pipeLengthWithReserve = Math.round(finalPipeLength * (1 + constants_1.HEATING_CONSTANTS.RESERVE_PERCENTAGE));
    const circuitsCount = circuits.length;
    const manifoldPorts = circuitsCount; // 1 ta kirish, 1 ta chiqish har bir kontur uchun
    // Quyoshli xonalar uchun servo-klapan tavsiya etiladi (kunduzi haddan tashqari qizib ketishni oldini oladi)
    const servoActuatorsCount = isSunny ? circuitsCount : Math.min(circuitsCount, 1);
    // Qozon quvvati (1.25 zaxira bilan)
    const boilerPowerKw = parseFloat(((totalHeatLossW / 1000) * 1.25).toFixed(2));
    // Konstruksiya tavsiyasi:
    let screedRecommendation = 'classic_concrete';
    let screedDescription = 'Standart xonalar uchun klassik beton styajka (issiqlikni uzoq saqlovchi mustahkam inersiya).';
    if (isSunny && (totalWindowWidth >= 2.5 || area >= 25)) {
        screedRecommendation = 'dry_lightweight';
        screedDescription = 'Katta oynali va quyoshli xonalar uchun "Quruq yengil pol" (Tez isish va tez sovush xususiyati, kunduzgi qizib ketishni kamaytiradi).';
    }
    return {
        totalHeatLossW,
        specificHeatLossWM2: specificLossWM2,
        shagZones,
        pipeLengthM: finalPipeLength,
        pipeLengthWithReserveM: pipeLengthWithReserve,
        circuitsCount,
        circuits,
        manifoldPorts,
        servoActuatorsCount,
        boilerPowerKw,
        screedRecommendation,
        screedDescription,
        comfortModeTempC: 23, // Plitka sovuq bo'lib qolmasligi uchun minimal fon harorati
        insulationAreaM2: Math.round(area),
        dampingTapeLengthM: Math.round(perimeter),
        insolation,
    };
}
