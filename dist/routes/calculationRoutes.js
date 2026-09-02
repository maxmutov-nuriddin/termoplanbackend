"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calculationController_1 = require("../controllers/calculationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Loyiha bo'yicha to'liq hisob-kitobni ishga tushirish (Generatsiya qilish)
router.post('/project/:projectId/generate', authMiddleware_1.authMiddleware, calculationController_1.CalculationController.calculateProject);
router.get('/project/:projectId', authMiddleware_1.authMiddleware, calculationController_1.CalculationController.getProjectCalculations);
exports.default = router;
