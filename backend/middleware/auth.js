import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuthenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Please to access this resource" });
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodedData._id);
  next();
};
