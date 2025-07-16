// ✅ Updated user.controller.js with improved error handling and consistent JSON responses

import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import multiavatar from '@multiavatar/multiavatar/esm';

// ✅ User Registration
const userRegister = AsyncHandler(async (req, res) => {
  const { name, gender, userName, phonenumber, email, password } = req.body;

  if (!name || !gender || !userName || !phonenumber || !email || !password) {
    return res.status(400).json(new ApiResponse(400, null, "Please fill all fields."));
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { phonenumber }, { userName }],
  });

  if (existedUser) {
    return res.status(409).json(new ApiResponse(409, null, "User already registered. Please login."));
  }

  const svgCode = multiavatar(userName);
  const base64Avatar = Buffer.from(svgCode).toString('base64');
  const hashPassword = await User.hashPassword(password);

  const user = await User.create({
    name,
    gender,
    userName,
    phonenumber,
    email,
    password: hashPassword,
    avtar: `data:image/svg+xml;base64,${base64Avatar}`,
  });

  return res.status(201).json(new ApiResponse(201, user, "User successfully registered."));
});

// ✅ User Login
const userLogin = AsyncHandler(async (req, res) => {
  const { phonenumber, email, password } = req.body;

  if ((!email && !phonenumber) || !password) {
    return res.status(400).json(new ApiResponse(400, null, "Please fill all fields."));
  }

  const user = await User.findOne(email ? { email } : { phonenumber });

  if (!user) {
    return res.status(401).json(new ApiResponse(401, null, "User not found! Please register."));
  }

  const isCorrectPass = await user.comparePassword(password);
  if (!isCorrectPass) {
    return res.status(400).json(new ApiResponse(400, null, "Incorrect password"));
  }

  const Authtoken = await user.generateAuthToken();

  res.cookie("token", Authtoken, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  const loggedinUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new ApiResponse(200, { loggedinUser, Authtoken }, "User successfully logged in.")
  );
});

// ✅ Get Current User
const getUser = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully."));
});

// ✅ Logout
const userLogout = AsyncHandler(async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(400).json(new ApiResponse(400, null, "User not logged in."));
  }

  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: "none",
    path: "/"
  });

  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully."));
});

// ✅ Change Password
const updatePassword = AsyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isOldPassword = await user.comparePassword(oldpassword);
  if (!isOldPassword) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid current password"));
  }

  user.password = await User.hashPassword(newpassword);
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully."));
});

// ✅ Upload Profile Image
const uploadImage = AsyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "Please upload a file."));
  }

  const imageUrl = `/Image/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avtar: imageUrl },
    { new: true }
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }

  return res.status(200).json(new ApiResponse(200, { imageUrl, user }, "Image uploaded successfully."));
});

// ✅ Get All Users (for contacts, excluding self)
const Alluser = AsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { phonenumber: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  return res.status(200).json(new ApiResponse(200, users, "Contacts fetched successfully."));
});

export {
  userRegister,
  userLogin,
  updatePassword,
  getUser,
  userLogout,
  uploadImage,
  Alluser,
};
