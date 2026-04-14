import express from "express";
import { createStatus, getAllStatuses, updateStatus, deleteStatus } from "../controllers/serviceRequestStatus.controller.js";
const router = express.Router();
router.post("/", createStatus);
router.get("/", getAllStatuses);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);
export default router;
