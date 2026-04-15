import express from "express";
import { register, login, getProfile, changePassword } from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyJwt, getProfile);
router.put("/change-password", verifyJwt, changePassword);
export default router;
