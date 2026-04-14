import express from "express";
import { addReply, getRepliesByRequest, deleteReply } from "../controllers/serviceRequestReply.controller.js";
const router = express.Router();
router.post("/", addReply);
router.get("/:requestId", getRepliesByRequest);
router.delete("/:id", deleteReply);
export default router;
