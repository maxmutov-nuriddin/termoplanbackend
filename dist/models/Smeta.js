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
exports.Smeta = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SmetaItemSchema = new mongoose_1.Schema({
    id: String,
    category: {
        type: String,
        enum: ['heating', 'cooling', 'insulation', 'automation', 'installation'],
        required: true,
    },
    name: { type: String, required: true },
    description: String,
    unit: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unitPriceUzs: { type: Number, required: true, default: 0 },
    totalPriceUzs: { type: Number, required: true, default: 0 },
    isOptional: { type: Boolean, default: false },
}, { _id: false });
const SmetaSchema = new mongoose_1.Schema({
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    items: [SmetaItemSchema],
    totalHeatingCostUzs: { type: Number, default: 0 },
    totalCoolingCostUzs: { type: Number, default: 0 },
    totalInstallationCostUzs: { type: Number, default: 0 },
    grandTotalUzs: { type: Number, default: 0 },
    grandTotalUsd: { type: Number, default: 0 },
    usdExchangeRate: { type: Number, default: 12850 },
    notes: [String],
}, { timestamps: true });
exports.Smeta = mongoose_1.default.model('Smeta', SmetaSchema);
