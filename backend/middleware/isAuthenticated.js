import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/sendResponse.js";
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendResponse(
        res,
        401,
        false,
        "Autherization token is misssing or invalid",
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const searchId = decoded.id || decoded._id;

    if (!searchId) {
      return sendResponse(res, 401, false, "Malformed token payload structure");
    }

    const user = await User.findById(searchId);
    if (!user) {
      return sendResponse(res, 401, false, "User Not Found");
    }
    req.user = user;
    req.id = user._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(
        res,
        401,
        false,
        "The registration token has expired",
      );
    }
    if (error.name === "JsonWebTokenError") {
      return sendResponse(
        res,
        401,
        false,
        "Access token is missing or invalid",
      );
    }
    return sendResponse(res, 500, false, error.message);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return sendResponse(res, 403, false, "Access denied: admins only");
};
