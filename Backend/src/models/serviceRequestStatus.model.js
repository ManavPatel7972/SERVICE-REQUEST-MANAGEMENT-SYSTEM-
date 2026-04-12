import mongoose from "mongoose";

const serviceRequestStatusSchema = new mongoose.Schema({
  serviceRequestStatusName: { type: String, required: true, trim: true },
  serviceRequestStatusSystemName: { type: String, required: true, trim: true },
  sequence: { type: Number, default: 0 },
  description: { type: String, trim: true },
  cssClass: { type: String, default: "badge-secondary" },
  isOpen: { type: Boolean, default: true },
  isNoFurtherActionRequired: { type: Boolean, default: false },
  isAllowedForTechnician: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceRequestStatus = mongoose.model("ServiceRequestStatus", serviceRequestStatusSchema);
