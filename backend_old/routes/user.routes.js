import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getUserProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/profile', protect, getUserProfile);
userRouter.get(
  '/astrologer-only',
  protect,
  authorizeRoles('astrologer'),
  (req, res) => res.send('Astrologer access granted!')
);

export default userRouter;

