"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = void 0;
// src/routes/payments.routes.ts
const express_1 = require("express");
const payments_controller_1 = require("../controller/payments.controller");
const router = (0, express_1.Router)();
exports.paymentsRoutes = router;
router.get('/', payments_controller_1.getAllPayments);
router.get('/:id', payments_controller_1.getPaymentById);
router.post('/', payments_controller_1.createPayment);
router.put('/:id', payments_controller_1.updatePayment);
router.delete('/:id', payments_controller_1.deletePayment);
//# sourceMappingURL=paymentsRouter.js.map