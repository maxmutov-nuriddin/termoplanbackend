"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRoomCooling = calculateRoomCooling;
const climateData_1 = require("../config/climateData");
const constants_1 = require("../config/constants");
const insolationCalculator_1 = require("./insolationCalculator");
/**
 * 2D Havo Oqimi Konusi nuqtalarini hisoblash (SVG uchun)
 */
function calculateAirflowConePoints(origin, centerAngleDeg, spreadDeg, rangeM) {
    const points = [origin];
    const halfSpread = spreadDeg / 2;
    const steps = 8;
    const startAngle = (centerAngleDeg - halfSpread) * (Math.PI / 180);
    const endAngle = (centerAngleDeg + halfSpread) * (Math.PI / 180);
    const angleStep = (endAngle - startAngle) / steps;
    for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        points.push({
            x: parseFloat((origin.x + Math.cos(angle) * rangeM).toFixed(3)),
            y: parseFloat((origin.y + Math.sin(angle) * rangeM).toFixed(3)),
        });
    }
    return points;
}
/**
 * Yozgi sovutish va Smart AC Joylashuvi hisobi
 */
function calculateRoomCooling(room, project) {
    const region = climateData_1.UZBEKISTAN_CLIMATE_DATA[project.regionId] || climateData_1.UZBEKISTAN_CLIMATE_DATA['tashkent'];
    const area = room.area || 20;
    const ceilingHeight = room.ceilingHeight || project.defaultCeilingHeight || 3.0;
    const volume = area * ceilingHeight;
    // Insolyatsiya tahlili
    const insolation = (0, insolationCalculator_1.analyzeInsolation)(project.regionId, project.compassNorthAngle || 0, room.walls || [], room.windows || []);
    // Xona hajmi bo'yicha bazaviy sovutish
    const baseCoolingW = volume * constants_1.COOLING_CONSTANTS.BASE_COOLING_W_M3;
    // Quyosh va oynalar issiqlik yuki
    let windowSolarHeatW = 0;
    if (room.windows && room.windows.length > 0) {
        for (const win of room.windows) {
            const winArea = (win.width || 1.4) * (win.height || 1.6);
            const heatRate = win.type === 'low_e' ? constants_1.COOLING_CONSTANTS.WINDOW_HEAT_LOW_E_W_M2 : constants_1.COOLING_CONSTANTS.WINDOW_HEAT_ORDINARY_W_M2;
            windowSolarHeatW += winArea * heatRate;
        }
    }
    else {
        windowSolarHeatW = (area * 0.15) * constants_1.COOLING_CONSTANTS.WINDOW_HEAT_ORDINARY_W_M2;
    }
    // Odamlar va texnika yuki
    const peopleCount = room.roomType === 'bedroom' ? 2 : room.roomType === 'living_room' ? 4 : 2;
    const internalHeatW = (peopleCount * constants_1.COOLING_CONSTANTS.PERSON_HEAT_W) + constants_1.COOLING_CONSTANTS.APPLIANCE_HEAT_W;
    // Umumiy sovutish yuki (quyosh koeffitsiyenti bilan)
    const totalCoolingLoadW = Math.round((baseCoolingW * insolation.coolingMultiplier) + windowSolarHeatW + internalHeatW);
    // BTU modelini tanlash
    let selectedBtuInfo = constants_1.COOLING_CONSTANTS.BTU_SIZES[1]; // Default 09 (9000 BTU)
    for (const btuItem of constants_1.COOLING_CONSTANTS.BTU_SIZES) {
        if (btuItem.kw * 1000 >= totalCoolingLoadW || btuItem.maxAreaM2 >= area) {
            selectedBtuInfo = btuItem;
            break;
        }
    }
    // Xona o'lchamlari
    let roomWidthM = Math.sqrt(area * 1.2);
    let roomHeightM = area / roomWidthM;
    if (room.points && room.points.length >= 3) {
        const xs = room.points.map((p) => p.x);
        const ys = room.points.map((p) => p.y);
        roomWidthM = Math.max(2, Math.max(...xs) - Math.min(...xs));
        roomHeightM = Math.max(2, Math.max(...ys) - Math.min(...ys));
    }
    // Smart AC Placement Algoritmi:
    // 1. Krovat/Divan/Ish stoli joyini aniqlash
    const sensitiveFurniture = (room.furniture || []).filter((f) => f.isCoolingSensitive !== false && ['bed', 'sofa', 'desk'].includes(f.type));
    // Default optimal nuqta: yuqori devor burchagi (oynaga yaqin va xona diagonali bo'ylab)
    let bestAcPos = { x: 0.8, y: 0.15 };
    let bestAngleDeg = 45; // Diagonali bo'ylab
    let directBlowingAvoided = true;
    const safetyNotes = [];
    if (sensitiveFurniture.length > 0) {
        const mainItem = sensitiveFurniture[0];
        const isItemOnTop = mainItem.position.y < roomHeightM / 2;
        const isItemOnLeft = mainItem.position.x < roomWidthM / 2;
        if (isItemOnTop) {
            // Mebel yuqorida bo'lsa, AC yon devorga yoki mebelning bosh qismi tepasiga qo'yiladi (havo pastga qarab ketadi)
            bestAcPos = { x: Number((roomWidthM - 0.8).toFixed(2)), y: 0.15 };
            bestAngleDeg = 120; // Chapga-pastga
            safetyNotes.push(`Konditsioner ${mainItem.type === 'bed' ? 'krovat' : 'divan'} ustiga to‘g‘ridan-to‘g‘ri urilmasligi uchun xonaning qarama-qarshi tomoniga yo‘naltirildi.`);
        }
        else {
            // Mebel pastda bo'lsa, AC yuqori devorda xavfsiz turadi
            bestAcPos = { x: Number((roomWidthM * 0.3).toFixed(2)), y: 0.15 };
            bestAngleDeg = 75; // Pastga-o'ngga
            safetyNotes.push(`Sovuq havo oqimi to‘g‘ridan-to‘g‘ri dam olish hududini aylanib o‘tishga sozlangan.`);
        }
    }
    else {
        safetyNotes.push('Xonaning butun maydonini qamrab oluvchi eng uzun diagonal bo‘ylab sozlangan.');
    }
    // Tashqi blok pozitsiyasi (eng yaqin tashqi devor yoki oyna orqasida)
    const outdoorUnitPosition = {
        x: Number((roomWidthM - 0.2).toFixed(2)),
        y: 0.0,
    };
    // Mis trassa uzunligi (metr)
    const copperRouteLengthM = parseFloat((Math.sqrt(Math.pow(outdoorUnitPosition.x - bestAcPos.x, 2) +
        Math.pow(outdoorUnitPosition.y - bestAcPos.y, 2)) + 1.5).toFixed(1)); // +1.5m devordan o'tish va ulanish
    // 2D Havo Oqimi Konusi
    const airflowConePoints = calculateAirflowConePoints(bestAcPos, bestAngleDeg, constants_1.COOLING_CONSTANTS.AIRFLOW_ANGLE_DEG, Math.min(constants_1.COOLING_CONSTANTS.AIRFLOW_RANGE_M, Math.max(roomWidthM, roomHeightM) * 0.9));
    if (insolation.highRiskOverheating) {
        safetyNotes.push(`Janubiy/G'arbiy quyosh nuri kuchli bo'lgani sababli quvvatga +25% zaxira qo'shildi.`);
    }
    return {
        totalCoolingLoadW,
        recommendedBtu: selectedBtuInfo.btu,
        recommendedKw: selectedBtuInfo.kw,
        recommendedModel: selectedBtuInfo.name,
        optimalAcPosition: {
            x: bestAcPos.x,
            y: bestAcPos.y,
            targetAngle: bestAngleDeg,
        },
        airflowCone: {
            origin: bestAcPos,
            angle: bestAngleDeg,
            spreadDeg: constants_1.COOLING_CONSTANTS.AIRFLOW_ANGLE_DEG,
            rangeM: Math.min(constants_1.COOLING_CONSTANTS.AIRFLOW_RANGE_M, Math.max(roomWidthM, roomHeightM)),
            polygonPoints: airflowConePoints,
        },
        outdoorUnitPosition,
        copperRouteLengthM,
        directBlowingAvoided,
        safetyNotes,
        insolation,
    };
}
