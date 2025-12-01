"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestsRoutes = void 0;
// src/routes/guests.routes.ts
const express_1 = require("express");
const guests_controller_1 = require("../controller/guests.controller");
const router = (0, express_1.Router)();
exports.guestsRoutes = router;
router.get('/', guests_controller_1.getAllGuests);
router.get('/:id', guests_controller_1.getGuestById);
router.post('/', guests_controller_1.createGuest);
router.put('/:id', guests_controller_1.updateGuest);
router.delete('/:id', guests_controller_1.deleteGuest);
//# sourceMappingURL=guestsRouter.js.map