import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {  registerUserController, loginUserController, logoutUserController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout",protect,logoutUserController)

export default router;

