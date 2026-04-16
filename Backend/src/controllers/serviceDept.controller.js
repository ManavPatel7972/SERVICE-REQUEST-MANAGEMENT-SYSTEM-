import { ServiceDept } from "../models/serviceDept.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDept = asyncHandler(async (req, res) => {
  const { serviceDeptName, campusId, description, ccEmailToCSV, isRequestTitleDisable } = req.body;
  if (!serviceDeptName) throw new ApiError(400, "Department name is required");
  const dept = await ServiceDept.create({ serviceDeptName, campusId, description, ccEmailToCSV, isRequestTitleDisable, createdBy: req.user.id });
  res.status(201).json(new ApiResponse(201, dept, "Department created"));
});

export const getAllDepts = asyncHandler(async (req, res) => {
  const depts = await ServiceDept.find({ isActive: true }).sort({ serviceDeptName: 1 });
  res.json(new ApiResponse(200, depts, "Departments fetched"));
});

export const getDeptById = asyncHandler(async (req, res) => {
  const dept = await ServiceDept.findById(req.params.id);
  if (!dept) throw new ApiError(404, "Department not found");
  res.json(new ApiResponse(200, dept, "Department fetched"));
});

export const updateDept = asyncHandler(async (req, res) => {
  const dept = await ServiceDept.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dept) throw new ApiError(404, "Department not found");
  res.json(new ApiResponse(200, dept, "Department updated"));
});

export const deleteDept = asyncHandler(async (req, res) => {
  const dept = await ServiceDept.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!dept) throw new ApiError(404, "Department not found");
  res.json(new ApiResponse(200, null, "Department deleted"));
});
