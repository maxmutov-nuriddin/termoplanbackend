"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/termoplan';
    try {
        mongoose_1.default.set('strictQuery', false);
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] MongoDB muvaffaqiyatli ulandi: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.warn(`[Database] MongoDB ga ulanishda ogohlantirish (in-memory/offline fallback faollashadi):`, error.message);
    }
};
exports.connectDatabase = connectDatabase;
