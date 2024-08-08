import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloud } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //  Write down ths steps
  // 1. Get user details from frontend
  const { username, fullName, email, password } = req.body;
  // 2. Validation - not empty
  if (
    [username, fullName, email, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }
  // 3. Check user is already exists: name , email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.");
  }
  // 4. Check for images, check for avatar

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required path not found.");
  }
  // 5. Upload to them cloudinary, avatar check
  const avatar = await uploadOnCloud(avatarLocalPath);
  const coverImage = await uploadOnCloud(coverImageLocalPath);

  if (!avatar || !coverImage) {
    throw new ApiError(
      400,
      "Avatar and coverImage file is required after cloudinary response"
    );
  }
  // 6. Create user object,
  // 7. Create entry in database
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    avatar: avatar,
    coverImage: coverImage ,
    email,
    password,
  });
  // Exclude password and refreshToken from the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 9. Check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // 10. Return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});
export { registerUser };
