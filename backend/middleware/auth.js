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
  console.log(decodedData)
  req.user = await userModel.findById(decodedData.id);
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return res.status(403).json({success: false, message: `Role: ${req.user.role} cannot access to this resource`})
    }
    next()
  }
};
