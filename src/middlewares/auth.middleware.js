import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // 1. get token from cookies or Authorization Header
    // 2. don't have any token throw an error
    // 3. Decoded the token
    // 4. find user by id from decoded token
    // 5. don't have user throw an error
    // 6. set the user to = req.user = user  next()
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorize request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      //*TODO - discuss about frontend
      throw new ApiError(401, "Invalid access token");
    }
    // finally
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
