import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "Name, email and password are required");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, phone, password, role: role || "USER" });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json(new ApiResponse(201, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
  }, "Registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, "Invalid credentials");

  const token = generateToken({ id: user._id, role: user.role });

  res.json(new ApiResponse(200, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
  }, "Login successful"));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "Profile fetched"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new ApiError(400, "Both passwords required");

  const user = await User.findById(req.user.id);
  const match = await user.comparePassword(currentPassword);
  if (!match) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();
  res.json(new ApiResponse(200, null, "Password changed successfully"));
});
