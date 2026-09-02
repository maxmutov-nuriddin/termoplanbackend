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
exports.Room = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PointSchema = new mongoose_1.Schema({ x: Number, y: Number }, { _id: false });
const WallSchema = new mongoose_1.Schema({
    id: String,
    startPoint: PointSchema,
    endPoint: PointSchema,
    isExternal: { type: Boolean, default: true },
    orientation: { type: String, default: 'NORTH' },
    length: { type: Number, default: 0 },
}, { _id: false });
const WindowSchema = new mongoose_1.Schema({
    id: String,
    wallId: String,
    position: PointSchema,
    width: { type: Number, default: 1.4 },
    height: { type: Number, default: 1.6 },
    orientation: { type: String, default: 'NORTH' },
    type: { type: String, enum: ['ordinary', 'low_e', 'tinted'], default: 'ordinary' },
}, { _id: false });
const DoorSchema = new mongoose_1.Schema({
    id: String,
    wallId: String,
    position: PointSchema,
    width: { type: Number, default: 0.9 },
    openDirection: { type: String, default: 'inside_right' },
}, { _id: false });
const FurnitureSchema = new mongoose_1.Schema({
    id: String,
    type: {
        type: String,
        enum: ['bed', 'sofa', 'desk', 'dining_table', 'wardrobe', 'kitchen_set', 'tv_unit'],
        default: 'sofa',
    },
    label: String,
    position: PointSchema,
    width: { type: Number, default: 1.0 },
    height: { type: Number, default: 1.0 },
    rotation: { type: Number, default: 0 },
    isHeatingProhibited: { type: Boolean, default: true },
    isCoolingSensitive: { type: Boolean, default: true },
}, { _id: false });
const RoomSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, default: 'Yangi xona' },
    roomType: {
        type: String,
        enum: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'hall', 'office', 'dining'],
        default: 'living_room',
    },
    area: { type: Number, required: true, default: 20 },
    perimeter: { type: Number, default: 18 },
    ceilingHeight: { type: Number, default: 3.0 },
    points: [PointSchema],
    walls: [WallSchema],
    windows: [WindowSchema],
    doors: [DoorSchema],
    furniture: [FurnitureSchema],
    manifoldPosition: PointSchema,
    acPosition: {
        x: Number,
        y: Number,
        wallId: String,
        targetAngle: { type: Number, default: 0 },
    },
    outdoorUnitPosition: PointSchema,
    floorCovering: {
        type: String,
        enum: ['tile', 'laminate', 'parquet', 'carpet'],
        default: 'tile',
    },
}, { timestamps: true });
exports.Room = mongoose_1.default.model('Room', RoomSchema);
