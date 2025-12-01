"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsRoutes = void 0;
// src/routes/bookings.routes.ts
const express_1 = require("express");
const bookings_controller_1 = require("../controller/bookings.controller");
const router = (0, express_1.Router)();
exports.bookingsRoutes = router;
router.get('/', bookings_controller_1.getAllBookings);
router.get('/:id', bookings_controller_1.getBookingById);
router.post('/', bookings_controller_1.createBooking);
router.put('/:id', bookings_controller_1.updateBooking);
router.delete('/:id', bookings_controller_1.deleteBooking);
//# sourceMappingURL=bookingsRouter.js.map