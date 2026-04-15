import { ServiceType } from "../models/serviceType.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createServiceType = asyncHandler(async (req, res) => {
  const { serviceTypeName, description, sequence, isForStaff, isForStudent } = req.body;
  if (!serviceTypeName) throw new ApiError(400, "Service type name is required");
  const type = await ServiceType.create({ serviceTypeName, description, sequence, isForStaff, isForStudent, createdBy: req.user.id });
  res.status(201).json(new ApiResponse(201, type, "Service type created"));
});

export const getAllServiceTypes = asyncHandler(async (req, res) => {
  const types = await ServiceType.find({ isActive: true }).sort({ sequence: 1, serviceTypeName: 1 });
  res.json(new ApiResponse(200, types, "Service types fetched"));
});

export const updateServiceType = asyncHandler(async (req, res) => {
  const type = await ServiceType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!type) throw new ApiError(404, "Service type not found");
  res.json(new ApiResponse(200, type, "Service type updated"));
});

export const deleteServiceType = asyncHandler(async (req, res) => {
  const type = await ServiceType.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!type) throw new ApiError(404, "Service type not found");
  res.json(new ApiResponse(200, null, "Service type deleted"));
});
