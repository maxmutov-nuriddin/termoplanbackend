"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfController_1 = require("../controllers/pdfController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// 4-sahifali muhandislik PDF loyihasini yuklab olish
router.get('/project/:projectId/export', authMiddleware_1.authMiddleware, pdfController_1.PdfController.exportProjectPdf);
exports.default = router;
