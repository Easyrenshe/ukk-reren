// src/routes/payments.routes.ts
import { Router } from 'express';
import { getAllPayments, getPaymentById, createPayment, updatePayment, deletePayment } from '../controller/payments.controller';

const router: Router = Router();

router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export { router as paymentsRoutes };