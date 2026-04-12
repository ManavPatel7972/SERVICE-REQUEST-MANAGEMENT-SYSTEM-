import { ApiError } from "../utils/ApiError.js";

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, "Forbidden - Insufficient permissions");
  }
  next();
};
