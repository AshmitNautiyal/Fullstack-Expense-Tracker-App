import express from 'express';
import { signupuser , loginUser } from '../controller/authcontroller.js';

const router = express.Router();

router.post("/signup" , signupuser);
router.post("/login" , loginUser);

export default router;