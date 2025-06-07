import express from "express";
import {  verifyToken } from "../middleware/authMiddleware.js";
import {  registerUserController, loginUserController, logoutUserController, getUserProfile, updateUserProfile, verifyEmailController  } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout",verifyToken,logoutUserController)
router.get("/profile", verifyToken, getUserProfile)
router.put("/profile", verifyToken, updateUserProfile)
router.post("/verify-email", verifyEmailController)

export default router;

