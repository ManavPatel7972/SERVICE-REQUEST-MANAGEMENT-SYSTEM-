import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true }).select("-password -refreshToken").sort({ name: 1 });
  res.json(new ApiResponse(200, users, "Users fetched"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "User fetched"));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "Required fields missing");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, "Email already exists");

  const user = await User.create({ name, email, phone, password, role });
  res.status(201).json(new ApiResponse(201, { id: user._id, name: user.name, email: user.email, role: user.role }, "User created"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, phone, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, phone, role }, { new: true, runValidators: true }).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "User updated"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, null, "User deactivated"));
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  user.isActive = !user.isActive;
  await user.save();
  res.json(new ApiResponse(200, { isActive: user.isActive }, `User ${user.isActive ? "activated" : "deactivated"}`));
});
