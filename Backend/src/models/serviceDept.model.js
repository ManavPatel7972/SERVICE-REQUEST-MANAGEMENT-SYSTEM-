import mongoose from "mongoose";

const serviceDeptSchema = new mongoose.Schema({
  serviceDeptName: { type: String, required: true, trim: true },
  campusId: { type: Number, default: 1 },
  description: { type: String, trim: true },
  ccEmailToCSV: { type: String, trim: true },
  isRequestTitleDisable: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceDept = mongoose.model("ServiceDept", serviceDeptSchema);
