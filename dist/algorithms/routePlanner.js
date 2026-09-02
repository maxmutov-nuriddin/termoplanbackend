"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUnderfloorPipeRoutes = generateUnderfloorPipeRoutes;
const constants_1 = require("../config/constants");
const CIRCUIT_COLORS = [
    '#E63946', // Red
    '#2A9D8F', // Teal
    '#457B9D', // Steel Blue
    '#F4A261', // Sandy Orange
    '#9B5DE5', // Purple
    '#00BBF9', // Cyan
    '#00F5D4', // Mint
];
/**
 * 2D Spiral (Salyangoz) va Iloncha usulida quvurlar geometriyasini hisoblab marshrut generatsiya qilish
 */
function generateUnderfloorPipeRoutes(roomWidthM, roomHeightM, stepColdM = constants_1.HEATING_CONSTANTS.STEP_COLD_ZONE, stepComfortM = constants_1.HEATING_CONSTANTS.STEP_COMFORT_ZONE, stepSunnyM = constants_1.HEATING_CONSTANTS.STEP_SUNNY_ZONE, manifoldPos = { x: 0.2, y: 0.2 }, furniture = [], isSunnyRoom = false) {
    const margin = 0.15; // Devordan 15 sm oraliq
    let minX = margin;
    let maxX = Math.max(margin + 1, roomWidthM - margin);
    let minY = margin;
    let maxY = Math.max(margin + 1, roomHeightM - margin);
    const points = [];
    // Kollektordan boshlash
    points.push({ x: manifoldPos.x, y: manifoldPos.y });
    // Salyangoz (Spiral) usuli: Tashqi konturdan ichkariga qarab 10-15 sm qadam bilan kirish
    let currentStep = stepColdM; // Chegara zonada 10 sm
    let ringIndex = 0;
    let left = minX;
    let right = maxX;
    let top = minY;
    let bottom = maxY;
    // Tashqi sovuq chegara zonasidan spiral hosil qilish
    while (left < right - 0.2 && top < bottom - 0.2) {
        // 1-2 qator sovuq zona (10 sm), markazda 15 sm yoki quyoshli bo'lsa 20 sm
        if (ringIndex >= 2) {
            currentStep = isSunnyRoom ? stepSunnyM : stepComfortM;
        }
        // Yuqori gorizontal chiziq (chapdan o'ngga)
        points.push({ x: Number(left.toFixed(3)), y: Number(top.toFixed(3)) });
        points.push({ x: Number(right.toFixed(3)), y: Number(top.toFixed(3)) });
        // O'ng vertikal chiziq (yuqoridan pastga)
        points.push({ x: Number(right.toFixed(3)), y: Number(bottom.toFixed(3)) });
        // Quyi gorizontal chiziq (o'ngdan chapga)
        points.push({ x: Number((left + currentStep).toFixed(3)), y: Number(bottom.toFixed(3)) });
        // Chap vertikal chiziq (pastdan yuqoriga)
        points.push({ x: Number((left + currentStep).toFixed(3)), y: Number((top + currentStep).toFixed(3)) });
        left += currentStep;
        right -= currentStep;
        top += currentStep;
        bottom -= currentStep;
        ringIndex++;
    }
    // Markaziy nuqtaga yetgach, qaytish marshruti (return pipe)
    points.push({ x: Number(((left + right) / 2).toFixed(3)), y: Number(((top + bottom) / 2).toFixed(3)) });
    // Qaytuvchi quvurni kollektorga qaytarish
    points.push({ x: Number((manifoldPos.x + 0.1).toFixed(3)), y: Number((manifoldPos.y + 0.1).toFixed(3)) });
    // Umumiy quvur uzunligini hisoblash
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const segment = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        totalLength += segment;
    }
    // Agar uzunlik 85-90 metrdan oshsa, bir nechta konturga ajratish
    const circuits = [];
    const maxCircuitLen = constants_1.HEATING_CONSTANTS.MAX_LOOP_LENGTH_M;
    const numCircuits = Math.max(1, Math.ceil(totalLength / maxCircuitLen));
    if (numCircuits === 1) {
        circuits.push({
            circuitNumber: 1,
            lengthM: parseFloat(totalLength.toFixed(1)),
            color: CIRCUIT_COLORS[0],
            points: points,
        });
    }
    else {
        // Nuqtalarni teng qismlarga bo'lib, har bir konturni kollektorga ulash
        const pointsPerCircuit = Math.floor(points.length / numCircuits);
        for (let c = 0; c < numCircuits; c++) {
            const startIdx = c * pointsPerCircuit;
            const endIdx = c === numCircuits - 1 ? points.length : (c + 1) * pointsPerCircuit;
            const subPoints = [
                { x: manifoldPos.x, y: manifoldPos.y },
                ...points.slice(startIdx, endIdx),
                { x: manifoldPos.x + 0.1, y: manifoldPos.y + 0.1 }
            ];
            let subLen = 0;
            for (let i = 0; i < subPoints.length - 1; i++) {
                const p1 = subPoints[i];
                const p2 = subPoints[i + 1];
                subLen += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            }
            circuits.push({
                circuitNumber: c + 1,
                lengthM: parseFloat(subLen.toFixed(1)),
                color: CIRCUIT_COLORS[c % CIRCUIT_COLORS.length],
                points: subPoints,
            });
        }
    }
    return circuits;
}
