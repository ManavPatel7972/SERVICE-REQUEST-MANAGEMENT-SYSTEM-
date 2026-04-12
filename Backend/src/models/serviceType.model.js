import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
  serviceTypeName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  sequence: { type: Number, default: 0 },
  isForStaff: { type: Boolean, default: true },
  isForStudent: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);
