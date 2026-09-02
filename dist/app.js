"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const calculationRoutes_1 = __importDefault(require("./routes/calculationRoutes"));
const smetaRoutes_1 = __importDefault(require("./routes/smetaRoutes"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json({ limit: '15mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '15mb' }));
app.use((0, morgan_1.default)('dev'));
// Sog'lomlik holati (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'TermoPlan Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// Asosiy API yo'llari
app.use('/api/auth', authRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/calculations', calculationRoutes_1.default);
app.use('/api/smeta', smetaRoutes_1.default);
app.use('/api/pdf', pdfRoutes_1.default);
// Global xatoliklar boshqaruvi
app.use(errorHandler_1.errorHandler);
exports.default = app;
