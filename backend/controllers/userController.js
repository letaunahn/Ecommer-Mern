import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import sendToken from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existed = await userModel.findOne({ email });
    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Email has been used, Please enter another email",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a stronger password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      avatar: {
        public_id: "This is a sample img",
        url: "samplePicUrl",
      },
    });
    await user.save();
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password is incorrect" });
    }
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `${error}` });
  }
};

export const logoutUser = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return;
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/password/reset/${resetToken}`;

  const message = `Your password reset token is : - \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.json({
      success: false,
      message: "Reset password token is invalid or has been expired",
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({ success: false, message: "Password does not password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
};

export const getUserDetails = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};

export const updatePassword = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  const isPasswordMatch = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!isPasswordMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Old password is incorrect" });
  }
  if (!validator.isStrongPassword(req.body.newPassword)) {
    return json.status(400).json({
      success: false,
      message: "Please enter a stronger password",
    });
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    res.json({
      success: false,
      message: "Password does not match",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password has been updated",
  });
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Updated profile successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: `${error}`,
    });
  }
};

export const getAllUsers = async(req, res) => {
  const allUsers = await userModel.find({})
  try {
    res.status(200).json({
      success: true,
      allUsers
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}

export const getSingleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}

export const updateUserRole = async (req, res) => {
  const newRole =  {role: req.body.role}
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, newRole,{
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id)
    res.json({
      success:true,
      message: 'User has been deleted permanently'
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}


