import express from "express";
import { createDeptPerson, getAllDeptPersons, getDeptPersonById, updateDeptPerson, deleteDeptPerson } from "../controllers/serviceDeptPerson.controller.js";
const router = express.Router();
router.post("/", createDeptPerson);
router.get("/", getAllDeptPersons);
router.get("/:id", getDeptPersonById);
router.put("/:id", updateDeptPerson);
router.delete("/:id", deleteDeptPerson);
export default router;
