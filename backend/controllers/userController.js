import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import sendToken from "../utils/jwtToken.js";


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
        url: "samplePicUrl"
      }
    });
    await user.save();
    sendToken(user, 201, res)
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
    sendToken(user, 200, res)
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `${error}` });
  }
};
