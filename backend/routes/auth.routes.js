import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {  registerUserController, loginUserController, logoutUserController, getUserProfile, updateUserProfile, verifyEmailController  } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout",protect,logoutUserController)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.post("/verify-email", verifyEmailController)

export default router;

 