import { Router } from 'express';
import { PdfController } from '../controllers/pdfController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// 4-sahifali muhandislik PDF loyihasini yuklab olish
router.get('/project/:projectId/export', authMiddleware, PdfController.exportProjectPdf);

export default router;
