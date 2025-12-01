"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsRoutes = void 0;
// src/routes/rooms.routes.ts
const express_1 = require("express");
const rooms_controller_1 = require("../controller/rooms.controller");
const router = (0, express_1.Router)();
exports.roomsRoutes = router;
router.get('/', rooms_controller_1.getAllRooms);
router.get('/:id', rooms_controller_1.getRoomById);
router.post('/', rooms_controller_1.createRoom);
router.put('/:id', rooms_controller_1.updateRoom);
router.delete('/:id', rooms_controller_1.deleteRoom);
//# sourceMappingURL=roomsRouter.js.map