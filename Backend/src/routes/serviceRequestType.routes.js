import express from "express";
import { createRequestType, getAllRequestTypes, getRequestTypeById, updateRequestType, deleteRequestType } from "../controllers/serviceRequestType.controller.js";
const router = express.Router();
router.post("/", createRequestType);
router.get("/", getAllRequestTypes);
router.get("/:id", getRequestTypeById);
router.put("/:id", updateRequestType);
router.delete("/:id", deleteRequestType);
export default router;
