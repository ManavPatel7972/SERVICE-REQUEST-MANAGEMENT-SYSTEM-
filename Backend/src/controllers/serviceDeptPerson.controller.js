import { ServiceDeptPerson } from "../models/serviceDeptPerson.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDeptPerson = asyncHandler(async (req, res) => {
  const { serviceDeptId, userId, fromDate, toDate, description, isHODStaff } = req.body;
  if (!serviceDeptId || !userId || !fromDate) throw new ApiError(400, "Required fields missing");
  const mapping = await ServiceDeptPerson.create({ serviceDeptId, userId, fromDate, toDate, description, isHODStaff, createdBy: req.user.id });
  res.status(201).json(new ApiResponse(201, mapping, "Staff assigned to department"));
});

export const getAllDeptPersons = asyncHandler(async (req, res) => {
  const mappings = await ServiceDeptPerson.find({ isActive: true })
    .populate("serviceDeptId", "serviceDeptName")
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, mappings, "Mappings fetched"));
});

export const getDeptPersonById = asyncHandler(async (req, res) => {
  const mapping = await ServiceDeptPerson.findById(req.params.id)
    .populate("serviceDeptId", "serviceDeptName")
    .populate("userId", "name email role");
  if (!mapping) throw new ApiError(404, "Mapping not found");
  res.json(new ApiResponse(200, mapping, "Mapping fetched"));
});

export const updateDeptPerson = asyncHandler(async (req, res) => {
  const mapping = await ServiceDeptPerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!mapping) throw new ApiError(404, "Mapping not found");
  res.json(new ApiResponse(200, mapping, "Mapping updated"));
});

export const deleteDeptPerson = asyncHandler(async (req, res) => {
  const mapping = await ServiceDeptPerson.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!mapping) throw new ApiError(404, "Mapping not found");
  res.json(new ApiResponse(200, null, "Mapping removed"));
});
