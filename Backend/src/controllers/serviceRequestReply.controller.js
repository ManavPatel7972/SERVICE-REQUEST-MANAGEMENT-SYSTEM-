import { ServiceRequestReply } from "../models/serviceRequestReply.model.js";
import { ServiceRequest } from "../models/serviceRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addReply = asyncHandler(async (req, res) => {
  const { serviceRequestId, replyDescription, serviceRequestStatusId } = req.body;
  if (!serviceRequestId || !replyDescription) throw new ApiError(400, "Request ID and description required");

  const request = await ServiceRequest.findById(serviceRequestId);
  if (!request) throw new ApiError(404, "Service request not found");

  const reply = await ServiceRequestReply.create({
    serviceRequestId,
    userId: req.user.id,
    replyDescription,
    serviceRequestStatusId,
  });

  const populated = await reply.populate("userId", "name email role");
  res.status(201).json(new ApiResponse(201, populated, "Reply added"));
});

export const getRepliesByRequest = asyncHandler(async (req, res) => {
  const replies = await ServiceRequestReply.find({ serviceRequestId: req.params.requestId, isActive: true })
    .populate("userId", "name email role")
    .populate("serviceRequestStatusId", "serviceRequestStatusName cssClass")
    .sort({ createdAt: 1 });
  res.json(new ApiResponse(200, replies, "Replies fetched"));
});

export const deleteReply = asyncHandler(async (req, res) => {
  const reply = await ServiceRequestReply.findById(req.params.id);
  if (!reply) throw new ApiError(404, "Reply not found");

  const isOwner = reply.userId?.toString() === req.user.id;
  if (!["ADMIN", "HOD"].includes(req.user.role) && !isOwner) throw new ApiError(403, "Not authorized");

  await reply.deleteOne();
  res.json(new ApiResponse(200, null, "Reply deleted"));
});
