import { Router } from 'express';
import { CalculationController } from '../controllers/calculationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Loyiha bo'yicha to'liq hisob-kitobni ishga tushirish (Generatsiya qilish)
router.post('/project/:projectId/generate', authMiddleware, CalculationController.calculateProject);
router.get('/project/:projectId', authMiddleware, CalculationController.getProjectCalculations);

export default router;
