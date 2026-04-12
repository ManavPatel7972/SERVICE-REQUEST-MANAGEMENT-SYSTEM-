import mongoose from "mongoose";

const serviceRequestTypeSchema = new mongoose.Schema({
  serviceTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceType", required: true },
  serviceDeptId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceDept", required: true },
  serviceRequestTypeName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  sequence: { type: Number, default: 0 },
  defaultPriorityLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
  reminderDaysAfterAssignment: { type: Number, default: 3 },
  isVisibleResource: { type: Boolean, default: false },
  isMandatoryResource: { type: Boolean, default: false },
  requestTotal: { type: Number, default: 0 },
  requestPending: { type: Number, default: 0 },
  requestClosed: { type: Number, default: 0 },
  requestCancelled: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceRequestType = mongoose.model("ServiceRequestType", serviceRequestTypeSchema);
