// src/routes/rooms.routes.ts
import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controller/rooms.controller';

const router: Router = Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export { router as roomsRoutes };