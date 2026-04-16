import { ServiceRequestStatus } from "../models/serviceRequestStatus.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createStatus = asyncHandler(async (req, res) => {
  const {
    serviceRequestStatusName,
    serviceRequestStatusSystemName,
    sequence,
    description,
    cssClass,
    isOpen,
    isNoFurtherActionRequired,
    isAllowedForTechnician,
  } = req.body;
  if (!serviceRequestStatusName || !serviceRequestStatusSystemName)
    throw new ApiError(400, "Name and system name are required");
  const status = await ServiceRequestStatus.create({
    serviceRequestStatusName,
    serviceRequestStatusSystemName,
    sequence,
    description,
    cssClass,
    isOpen,
    isNoFurtherActionRequired,
    isAllowedForTechnician,
    createdBy: req.user.id,
  });
  res.status(201).json(new ApiResponse(201, status, "Status created"));
});

export const getAllStatuses = asyncHandler(async (req, res) => {
  const statuses = await ServiceRequestStatus.find({ isActive: true }).sort({
    sequence: 1,
    serviceRequestStatusName: 1,
  });
  res.json(new ApiResponse(200, statuses, "Statuses fetched"));
});

export const updateStatus = asyncHandler(async (req, res) => {
  const status = await ServiceRequestStatus.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!status) throw new ApiError(404, "Status not found");
  res.json(new ApiResponse(200, status, "Status updated"));
});

export const deleteStatus = asyncHandler(async (req, res) => {
  const status = await ServiceRequestStatus.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!status) throw new ApiError(404, "Status not found");
  res.json(new ApiResponse(200, null, "Status deleted"));
});
