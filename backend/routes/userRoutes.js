import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/profile', verifyToken, getUserProfile);
userRouter.get(
  '/astrologer-only',
  verifyToken,
  authorizeRoles('astrologer'),
  (req, res) => res.send('Astrologer access granted!')
);

export default userRouter;

 