// src/routes/guests.routes.ts
import { Router } from 'express';
import { getAllGuests, getGuestById, createGuest, updateGuest, deleteGuest } from '../controller/guests.controller';

const router: Router = Router();

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', createGuest);
router.put('/:id', updateGuest);
router.delete('/:id', deleteGuest);

export { router as guestsRoutes };