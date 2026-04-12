import { ServiceRequest } from "../models/serviceRequest.model.js";

export const generateServiceRequestNo = async () => {
  const year = new Date().getFullYear();
  const count = await ServiceRequest.countDocuments();
  const padded = String(count + 1).padStart(6, "0");
  return `SR-${year}-${padded}`;
};
