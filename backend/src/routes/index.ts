import { Router } from "express";
import { roomTypesRoutes } from "./roomTypesRouter";
import { guestsRoutes } from "./guestsRouter";
import { bookingsRoutes } from "./bookingsRouter";
import { authRoutes } from "./authRouter";
import { roomsRoutes } from "./roomsRouter";
import { paymentsRoutes } from "./paymentsRouter";

const router: Router = Router();

router.use("/api/room-types", roomTypesRoutes);
router.use("/api/guests", guestsRoutes);
router.use("/api/bookings", bookingsRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/rooms", roomsRoutes);
router.use("/api/payments", paymentsRoutes);

export { router as routes }; 