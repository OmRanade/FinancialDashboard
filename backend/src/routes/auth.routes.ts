// src/routes/auth.routes.ts
import express from 'express';
import { signup, login } from '../controllers/auth.controller'; // ✅ MUST use named import

const router = express.Router();

// Helper to wrap async route handlers and pass errors to Express
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));

export default router;
