"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const roomTypesRouter_1 = require("./roomTypesRouter");
const guestsRouter_1 = require("./guestsRouter");
const bookingsRouter_1 = require("./bookingsRouter");
const authRouter_1 = require("./authRouter");
const roomsRouter_1 = require("./roomsRouter");
const paymentsRouter_1 = require("./paymentsRouter");
const router = (0, express_1.Router)();
exports.routes = router;
router.use("/api/room-types", roomTypesRouter_1.roomTypesRoutes);
router.use("/api/guests", guestsRouter_1.guestsRoutes);
router.use("/api/bookings", bookingsRouter_1.bookingsRoutes);
router.use("/api/auth", authRouter_1.authRoutes);
router.use("/api/rooms", roomsRouter_1.roomsRoutes);
router.use("/api/payments", paymentsRouter_1.paymentsRoutes);
//# sourceMappingURL=index.js.map