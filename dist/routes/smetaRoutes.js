"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smetaController_1 = require("../controllers/smetaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/project/:projectId', authMiddleware_1.authMiddleware, smetaController_1.SmetaController.getProjectSmeta);
router.put('/project/:projectId', authMiddleware_1.authMiddleware, smetaController_1.SmetaController.updateSmeta);
exports.default = router;
