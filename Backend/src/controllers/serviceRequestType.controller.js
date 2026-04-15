import { ServiceRequestType } from "../models/serviceRequestType.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createRequestType = asyncHandler(async (req, res) => {
  const { serviceTypeId, serviceDeptId, serviceRequestTypeName, description, sequence, defaultPriorityLevel, reminderDaysAfterAssignment } = req.body;
  if (!serviceTypeId || !serviceDeptId || !serviceRequestTypeName) throw new ApiError(400, "Required fields missing");
  const type = await ServiceRequestType.create({ serviceTypeId, serviceDeptId, serviceRequestTypeName, description, sequence, defaultPriorityLevel, reminderDaysAfterAssignment, createdBy: req.user.id });
  res.status(201).json(new ApiResponse(201, type, "Request type created"));
});

export const getAllRequestTypes = asyncHandler(async (req, res) => {
  const types = await ServiceRequestType.find({ isActive: true })
    .populate("serviceTypeId", "serviceTypeName")
    .populate("serviceDeptId", "serviceDeptName")
    .sort({ sequence: 1, serviceRequestTypeName: 1 });
  res.json(new ApiResponse(200, types, "Request types fetched"));
});

export const getRequestTypeById = asyncHandler(async (req, res) => {
  const type = await ServiceRequestType.findById(req.params.id)
    .populate("serviceTypeId", "serviceTypeName")
    .populate("serviceDeptId", "serviceDeptName");
  if (!type) throw new ApiError(404, "Request type not found");
  res.json(new ApiResponse(200, type, "Request type fetched"));
});

export const updateRequestType = asyncHandler(async (req, res) => {
  const type = await ServiceRequestType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!type) throw new ApiError(404, "Request type not found");
  res.json(new ApiResponse(200, type, "Request type updated"));
});

export const deleteRequestType = asyncHandler(async (req, res) => {
  const type = await ServiceRequestType.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!type) throw new ApiError(404, "Request type not found");
  res.json(new ApiResponse(200, null, "Request type deleted"));
});
