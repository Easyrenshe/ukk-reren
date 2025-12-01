"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomTypesRoutes = void 0;
// src/routes/roomTypes.routes.ts
const express_1 = require("express");
const roomTypes_controller_1 = require("../controller/roomTypes.controller");
const router = (0, express_1.Router)();
exports.roomTypesRoutes = router;
router.get('/', roomTypes_controller_1.getAllRoomTypes);
router.get('/:id', roomTypes_controller_1.getRoomTypeById);
router.post('/', roomTypes_controller_1.createRoomType);
router.put('/:id', roomTypes_controller_1.updateRoomType);
router.delete('/:id', roomTypes_controller_1.deleteRoomType);
//# sourceMappingURL=roomTypesRouter.js.map