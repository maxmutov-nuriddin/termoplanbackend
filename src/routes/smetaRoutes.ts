import { Router } from 'express';
import { SmetaController } from '../controllers/smetaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/project/:projectId', authMiddleware, SmetaController.getProjectSmeta);
router.put('/project/:projectId', authMiddleware, SmetaController.updateSmeta);

export default router;
