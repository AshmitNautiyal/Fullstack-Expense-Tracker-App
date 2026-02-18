import express from 'express';
import authMiddleware from '../middleware/authMiddleWare.js';
import { getUser , updateUser , changePassword } from '../controller/userController.js';

const router = express.Router();
console.log("ROUTES LOADED");
router.get("/" , authMiddleware , getUser);
router.put("/change-password" , authMiddleware , changePassword);
router.put("/" , authMiddleware , updateUser);

export default router;