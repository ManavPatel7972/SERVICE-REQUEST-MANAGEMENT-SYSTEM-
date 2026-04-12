import mongoose from "mongoose";

const serviceRequestTypeWisePersonSchema = new mongoose.Schema({
  serviceRequestTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequestType", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const ServiceRequestTypeWisePerson = mongoose.model("ServiceRequestTypeWisePerson", serviceRequestTypeWisePersonSchema);
