import { ServiceRequestTypeWisePerson } from "../models/serviceRequestTypeWisePerson.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMapping = asyncHandler(async (req, res) => {
  const { serviceRequestTypeId, userId, fromDate, toDate, description } = req.body;
  if (!serviceRequestTypeId || !userId || !fromDate) throw new ApiError(400, "Required fields missing");
  const mapping = await ServiceRequestTypeWisePerson.create({ serviceRequestTypeId, userId, fromDate, toDate, description, createdBy: req.user.id });
  res.status(201).json(new ApiResponse(201, mapping, "Person mapped to request type"));
});

export const getAllMappings = asyncHandler(async (req, res) => {
  const mappings = await ServiceRequestTypeWisePerson.find({ isActive: true })
    .populate("serviceRequestTypeId", "serviceRequestTypeName")
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, mappings, "Mappings fetched"));
});

export const updateMapping = asyncHandler(async (req, res) => {
  const mapping = await ServiceRequestTypeWisePerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!mapping) throw new ApiError(404, "Mapping not found");
  res.json(new ApiResponse(200, mapping, "Mapping updated"));
});

export const deleteMapping = asyncHandler(async (req, res) => {
  const mapping = await ServiceRequestTypeWisePerson.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!mapping) throw new ApiError(404, "Mapping not found");
  res.json(new ApiResponse(200, null, "Mapping removed"));
});
