"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 5001;
async function startServer() {
    await (0, database_1.connectDatabase)();
    app_1.default.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 TermoPlan Backend Server ishga tushdi:`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
        console.log(`📍 Iqlim hududlari: http://localhost:${PORT}/api/projects/regions/climate`);
        console.log(`====================================================`);
    });
}
startServer().catch((err) => {
    console.error('[Server Startup Error]', err);
});
