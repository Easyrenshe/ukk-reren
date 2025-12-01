// src/routes/roomTypes.routes.ts
import { Router } from 'express';
import {
  getAllRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from '../controller/roomTypes.controller';

const router: Router = Router();

router.get('/', getAllRoomTypes);
router.get('/:id', getRoomTypeById);
router.post('/', createRoomType);
router.put('/:id', updateRoomType);
router.delete('/:id', deleteRoomType);

export { router as roomTypesRoutes };