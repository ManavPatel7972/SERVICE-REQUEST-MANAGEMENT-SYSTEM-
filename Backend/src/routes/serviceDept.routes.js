import express from "express";
import { createDept, getAllDepts, getDeptById, updateDept, deleteDept } from "../controllers/serviceDept.controller.js";
const router = express.Router();
router.post("/", createDept);
router.get("/", getAllDepts);
router.get("/:id", getDeptById);
router.put("/:id", updateDept);
router.delete("/:id", deleteDept);
export default router;
