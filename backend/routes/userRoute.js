import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { authorizeRoles, isAuthenticateUser } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/password/forgot", forgotPassword);
userRouter.put("/password/reset/:token", resetPassword);
userRouter.get("/myprofile", isAuthenticateUser, getUserDetails);
userRouter.put("/myprofile/update", isAuthenticateUser, updateProfile);
userRouter.put("/updatepassword", isAuthenticateUser, updatePassword);
userRouter.put("/updateprofile", isAuthenticateUser, updateProfile);
userRouter.get(
  "/admin/users",
  isAuthenticateUser,
  authorizeRoles("admin"),
  getAllUsers
);
userRouter.get(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  getSingleUser
);
userRouter.put(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/admin/user/:id",
  isAuthenticateUser,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
