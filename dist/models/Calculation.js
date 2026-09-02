"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calculation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CalculationSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' },
    heating: {
        totalHeatLossW: { type: Number, default: 0 },
        specificHeatLossWM2: { type: Number, default: 0 },
        shagZones: [
            {
                zone: String,
                stepCm: Number,
                areaM2: Number,
                description: String,
            },
        ],
        pipeLengthM: { type: Number, default: 0 },
        pipeLengthWithReserveM: { type: Number, default: 0 },
        circuitsCount: { type: Number, default: 1 },
        circuits: [
            {
                circuitNumber: Number,
                lengthM: Number,
                color: String,
                points: [{ x: Number, y: Number }],
            },
        ],
        manifoldPorts: { type: Number, default: 2 },
        servoActuatorsCount: { type: Number, default: 1 },
        boilerPowerKw: { type: Number, default: 0 },
        screedRecommendation: {
            type: String,
            enum: ['classic_concrete', 'dry_lightweight'],
            default: 'classic_concrete',
        },
        screedDescription: String,
        comfortModeTempC: { type: Number, default: 23 },
        insulationAreaM2: { type: Number, default: 0 },
        dampingTapeLengthM: { type: Number, default: 0 },
    },
    cooling: {
        totalCoolingLoadW: { type: Number, default: 0 },
        recommendedBtu: { type: Number, default: 9000 },
        recommendedKw: { type: Number, default: 2.6 },
        recommendedModel: String,
        optimalAcPosition: {
            x: Number,
            y: Number,
            wallId: String,
            targetAngle: { type: Number, default: 0 },
        },
        airflowCone: {
            origin: { x: Number, y: Number },
            angle: Number,
            spreadDeg: Number,
            rangeM: Number,
            polygonPoints: [{ x: Number, y: Number }],
        },
        outdoorUnitPosition: { x: Number, y: Number },
        copperRouteLengthM: { type: Number, default: 3 },
        directBlowingAvoided: { type: Boolean, default: true },
        safetyNotes: [String],
    },
    insolation: {
        solarFactor: { type: Number, default: 1.0 },
        highRiskOverheating: { type: Boolean, default: false },
        sunHoursDaily: { type: Number, default: 6 },
        orientationSummary: String,
    },
}, { timestamps: true });
exports.Calculation = mongoose_1.default.model('Calculation', CalculationSchema);
