import mongoose from "mongoose";

const serviceDeptPersonSchema = new mongoose.Schema({
  serviceDeptId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceDept", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date },
  description: { type: String, trim: true },
  isHODStaff: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceDeptPerson = mongoose.model("ServiceDeptPerson", serviceDeptPersonSchema);
