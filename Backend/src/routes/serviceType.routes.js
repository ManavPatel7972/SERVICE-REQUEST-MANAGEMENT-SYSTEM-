import express from "express";
import { createServiceType, getAllServiceTypes, updateServiceType, deleteServiceType } from "../controllers/serviceType.controller.js";
const router = express.Router();
router.post("/", createServiceType);
router.get("/", getAllServiceTypes);
router.put("/:id", updateServiceType);
router.delete("/:id", deleteServiceType);
export default router;
