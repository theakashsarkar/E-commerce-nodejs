import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { sendOtpMail } from "../emailVerify/sendOtpEmail.js";
import { Session } from "../models/sessionModel.js";
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          sucess: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: false,
      message: "Email verification successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "verification email not sent again",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Field is required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Password not match",
      });
    }
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );
    existingUser.isLoggedIn = true;
    await existingUser.save();
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }
    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Logout failed: User identity could not be verified",
      });
    }
    const sessionDeleteResult = await Session.deleteMany({ userId: userId });
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { isLoggedIn: false },
      { returnDocument: "after" },
    );
    if (!updateUser) {
      return res.status(444).json({
        success: false,
        message: "User Account profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user successfully logout",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const optExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = optExpiry;
    await user.save();
    await sendOtpMail(otp, email);
    return res.status(200).json({
      success: true,
      messsage: "otp sent to email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        messages: "otp is requried",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "otp is generated or already verified",
      });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        sussess: false,
        mssage: "otp is already expired",
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is invalid",
      });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Otp verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      messages: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password Not match",
      });
    }
    const hashedPassword = bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({
      success: true,
      message: "Password change successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allUser = async (_, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "Users Not found ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All users show",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
