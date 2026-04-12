import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  serviceRequestNo: { type: String, required: true, unique: true },
  serviceRequestDateTime: { type: Date, default: Date.now },
  serviceRequestTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequestType", required: true },
  serviceRequestTitle: { type: String, required: true, trim: true },
  serviceRequestDescription: { type: String, required: true, trim: true },
  attachmentPaths: [String],
  serviceRequestStatusId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequestStatus" },
  serviceRequestStatusDateTime: Date,
  serviceRequestStatusByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceRequestStatusDescription: String,
  approvalStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  approvalStatusDateTime: Date,
  approvalStatusByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvalStatusDescription: String,
  assignedToUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedDateTime: Date,
  assignedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedDescription: String,
  priorityLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
  onBehalfOfStaffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
