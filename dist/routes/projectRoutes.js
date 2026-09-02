"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const roomController_1 = require("../controllers/roomController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Iqlim ma'lumotlari (ochiq)
router.get('/regions/climate', projectController_1.ProjectController.getClimateRegions);
// Loyihalar CRUD
router.get('/', authMiddleware_1.authMiddleware, projectController_1.ProjectController.getAllProjects);
router.post('/', authMiddleware_1.authMiddleware, projectController_1.ProjectController.createProject);
router.get('/:id', authMiddleware_1.authMiddleware, projectController_1.ProjectController.getProjectById);
router.put('/:id', authMiddleware_1.authMiddleware, projectController_1.ProjectController.updateProject);
router.delete('/:id', authMiddleware_1.authMiddleware, projectController_1.ProjectController.deleteProject);
// Xonalar CRUD
router.post('/:projectId/rooms', authMiddleware_1.authMiddleware, roomController_1.RoomController.createRoom);
router.get('/rooms/:roomId', authMiddleware_1.authMiddleware, roomController_1.RoomController.getRoomById);
router.put('/rooms/:roomId', authMiddleware_1.authMiddleware, roomController_1.RoomController.updateRoom);
router.delete('/rooms/:roomId', authMiddleware_1.authMiddleware, roomController_1.RoomController.deleteRoom);
exports.default = router;
