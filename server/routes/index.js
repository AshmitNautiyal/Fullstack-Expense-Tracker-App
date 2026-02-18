import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import accountRoutes from './accountRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transaction', transactionRoutes);
router.use('/accounts', accountRoutes);

export default router;