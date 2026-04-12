import mongoose from "mongoose";

const serviceRequestReplySchema = new mongoose.Schema({
  serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  replyDescription: { type: String, required: true, trim: true },
  attachmentPaths: [String],
  serviceRequestStatusId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequestStatus" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const ServiceRequestReply = mongoose.model("ServiceRequestReply", serviceRequestReplySchema);
