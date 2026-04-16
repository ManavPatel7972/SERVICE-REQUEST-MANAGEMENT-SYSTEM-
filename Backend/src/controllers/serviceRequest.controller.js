import mongoose from "mongoose";
import { ServiceRequest } from "../models/serviceRequest.model.js";
import { ServiceRequestType } from "../models/serviceRequestType.model.js";
import { ServiceRequestStatus } from "../models/serviceRequestStatus.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateServiceRequestNo } from "../helper/generateServiceRequestNo.js";

const canAccess = (user, req) => {
  if (!user || !req) return false;
  const uid = user.id?.toString();
  const match = (v) => v?.toString() === uid;
  if (["ADMIN", "HOD"].includes(user.role)) return true;
  if (user.role === "TECHNICIAN") return match(req.assignedToUserId) || match(req.userId);
  return match(req.userId) || match(req.onBehalfOfStaffId);
};

export const createServiceRequest = asyncHandler(async (req, res) => {
  const { serviceRequestTypeId, serviceRequestTitle, serviceRequestDescription, attachmentPaths, priorityLevel, onBehalfOfStaffId } = req.body;
  if (!serviceRequestTypeId || !serviceRequestTitle || !serviceRequestDescription) throw new ApiError(400, "Required fields missing");

  const reqType = await ServiceRequestType.findOne({ _id: serviceRequestTypeId, isActive: true });
  const requestNo = await generateServiceRequestNo();

  const request = await ServiceRequest.create({
    serviceRequestNo: requestNo,
    serviceRequestTypeId,
    serviceRequestTitle,
    serviceRequestDescription,
    attachmentPaths,
    priorityLevel: priorityLevel || reqType?.defaultPriorityLevel || "MEDIUM",
    onBehalfOfStaffId,
    userId: req.user.id,
  });

  if (reqType) {
    reqType.requestTotal += 1;
    reqType.requestPending += 1;
    await reqType.save();
  }

  res.status(201).json(new ApiResponse(201, request, "Service request created"));
});

export const getAllServiceRequests = asyncHandler(async (req, res) => {
  const { role, id: uid } = req.user;
  let filter = {};
  if (role === "TECHNICIAN") {
    filter = { $or: [{ assignedToUserId: uid }, { userId: uid }] };
  } else if (!["ADMIN", "HOD"].includes(role)) {
    filter = { $or: [{ userId: uid }, { onBehalfOfStaffId: uid }] };
  }

  const requests = await ServiceRequest.find(filter)
    .populate("serviceRequestTypeId", "serviceRequestTypeName defaultPriorityLevel")
    .populate("serviceRequestStatusId", "serviceRequestStatusName cssClass")
    .populate("assignedToUserId", "name email role")
    .populate("userId", "name email")
    .populate("approvalStatusByUserId", "name")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, requests, "Requests fetched"));
});

export const getServiceRequestById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.requestId)) throw new ApiError(400, "Invalid ID");
  const request = await ServiceRequest.findById(req.params.requestId)
    .populate("serviceRequestTypeId")
    .populate("serviceRequestStatusId")
    .populate("assignedToUserId", "name email role")
    .populate("userId", "name email");
  if (!request) throw new ApiError(404, "Request not found");
  if (!canAccess(req.user, request)) throw new ApiError(403, "Not authorized");
  res.json(new ApiResponse(200, request, "Request fetched"));
});

export const updateServiceRequest = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.requestId)) throw new ApiError(400, "Invalid ID");
  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, "Request not found");
  if (!canAccess(req.user, request)) throw new ApiError(403, "Not authorized");

  const { serviceRequestTitle, serviceRequestDescription, priorityLevel } = req.body;
  if (serviceRequestTitle) request.serviceRequestTitle = serviceRequestTitle;
  if (serviceRequestDescription) request.serviceRequestDescription = serviceRequestDescription;
  if (priorityLevel) request.priorityLevel = priorityLevel;
  await request.save();
  res.json(new ApiResponse(200, request, "Request updated"));
});

export const assignRequest = asyncHandler(async (req, res) => {
  if (!["ADMIN", "HOD"].includes(req.user.role)) throw new ApiError(403, "Not authorized");
  const { assignedToUserId, assignedDescription } = req.body;
  if (!assignedToUserId || !mongoose.Types.ObjectId.isValid(assignedToUserId)) throw new ApiError(400, "Valid technician ID required");

  const tech = await User.findOne({ _id: assignedToUserId, role: "TECHNICIAN", isActive: true });
  if (!tech) throw new ApiError(404, "Active technician not found");

  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, "Request not found");

  request.assignedToUserId = assignedToUserId;
  request.assignedDateTime = new Date();
  request.assignedByUserId = req.user.id;
  request.assignedDescription = assignedDescription;
  await request.save();
  res.json(new ApiResponse(200, request, "Request assigned"));
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  if (!["ADMIN", "HOD", "TECHNICIAN"].includes(req.user.role)) throw new ApiError(403, "Not authorized");
  const { serviceRequestStatusId, serviceRequestStatusDescription } = req.body;
  if (!serviceRequestStatusId || !mongoose.Types.ObjectId.isValid(serviceRequestStatusId)) throw new ApiError(400, "Valid status ID required");

  const status = await ServiceRequestStatus.findById(serviceRequestStatusId);
  if (!status) throw new ApiError(404, "Status not found");

  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, "Request not found");

  request.serviceRequestStatusId = serviceRequestStatusId;
  request.serviceRequestStatusDateTime = new Date();
  request.serviceRequestStatusByUserId = req.user.id;
  request.serviceRequestStatusDescription = serviceRequestStatusDescription;
  await request.save();
  res.json(new ApiResponse(200, request, "Status updated"));
});

export const approveRequest = asyncHandler(async (req, res) => {
  if (!["ADMIN", "HOD"].includes(req.user.role)) throw new ApiError(403, "Not authorized");
  const { approvalStatus, approvalStatusDescription } = req.body;
  if (!["APPROVED", "REJECTED"].includes(approvalStatus)) throw new ApiError(400, "Invalid approval status");

  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, "Request not found");

  request.approvalStatus = approvalStatus;
  request.approvalStatusDateTime = new Date();
  request.approvalStatusByUserId = req.user.id;
  request.approvalStatusDescription = approvalStatusDescription;
  await request.save();
  res.json(new ApiResponse(200, request, `Request ${approvalStatus.toLowerCase()}`));
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.requestId);
  if (!request) throw new ApiError(404, "Request not found");

  const isOwner = request.userId?.toString() === req.user.id;
  if (!["ADMIN", "HOD"].includes(req.user.role) && !isOwner) throw new ApiError(403, "Not authorized");

  await request.deleteOne();
  res.json(new ApiResponse(200, null, "Request deleted"));
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, id: uid } = req.user;
  let filter = {};
  if (!["ADMIN", "HOD"].includes(role)) filter.userId = uid;

  const [total, pending, approved, rejected] = await Promise.all([
    ServiceRequest.countDocuments(filter),
    ServiceRequest.countDocuments({ ...filter, approvalStatus: "PENDING" }),
    ServiceRequest.countDocuments({ ...filter, approvalStatus: "APPROVED" }),
    ServiceRequest.countDocuments({ ...filter, approvalStatus: "REJECTED" }),
  ]);

  res.json(new ApiResponse(200, { total, pending, approved, rejected }, "Stats fetched"));
});
