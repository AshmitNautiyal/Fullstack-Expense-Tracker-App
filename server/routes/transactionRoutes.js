import express from 'express';
import authMiddleware from '../middleware/authMiddleWare.js';
import { getTransactions , addTransaction , transferMoney , getDashboardTransactions } from '../controller/transactionController.js';

const router = express.Router();

router.get("/" , authMiddleware , getTransactions);
router.get("/dashboard" , authMiddleware , getDashboardTransactions);
router.post("/add-transaction/:accountId" , authMiddleware , addTransaction);
router.put("/transfer-money" , authMiddleware , transferMoney);

export default router;

