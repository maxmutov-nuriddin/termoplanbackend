import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { RoomController } from '../controllers/roomController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Iqlim ma'lumotlari (ochiq)
router.get('/regions/climate', ProjectController.getClimateRegions);

// Loyihalar CRUD
router.get('/', authMiddleware, ProjectController.getAllProjects);
router.post('/', authMiddleware, ProjectController.createProject);
router.get('/:id', authMiddleware, ProjectController.getProjectById);
router.put('/:id', authMiddleware, ProjectController.updateProject);
router.delete('/:id', authMiddleware, ProjectController.deleteProject);

// Xonalar CRUD
router.post('/:projectId/rooms', authMiddleware, RoomController.createRoom);
router.get('/rooms/:roomId', authMiddleware, RoomController.getRoomById);
router.put('/rooms/:roomId', authMiddleware, RoomController.updateRoom);
router.delete('/rooms/:roomId', authMiddleware, RoomController.deleteRoom);

export default router;
