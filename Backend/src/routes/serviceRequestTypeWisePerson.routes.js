import express from "express";
import { createMapping, getAllMappings, updateMapping, deleteMapping } from "../controllers/serviceRequestTypeWisePerson.controller.js";
const router = express.Router();
router.post("/", createMapping);
router.get("/", getAllMappings);
router.put("/:id", updateMapping);
router.delete("/:id", deleteMapping);
export default router;
