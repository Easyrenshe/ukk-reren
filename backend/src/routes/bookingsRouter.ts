// src/routes/bookings.routes.ts
import { Router } from 'express';
import { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking } from '../controller/bookings.controller';

const router: Router = Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export { router as bookingsRoutes };