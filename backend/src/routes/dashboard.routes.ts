import { Router } from 'express';
import {
  getSummary,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportCSV
} from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use((req, res, next) => {authMiddleware(req, res, next)});

router.get('/summary', asyncHandler(getSummary));
router.get('/transactions', asyncHandler(getTransactions));
router.post('/transactions', asyncHandler(createTransaction));
router.put('/transactions/:id', asyncHandler(updateTransaction));
router.delete('/transactions/:id', asyncHandler(deleteTransaction));
router.post('/export', asyncHandler(exportCSV));

export default router;
