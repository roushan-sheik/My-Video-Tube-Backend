import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloud } from "../utils/Cloudinary.js";

// token generate method
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Some thing went wrong while generating access and refresh tokens."
    );
  }
};

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
    coverImage: coverImage,
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
// Login User controller

const loginUser = asyncHandler(async (req, res) => {
  // 1. get data from req body
  const { username, email, password } = req.body;
  // 2. username or email based login
  if (!username && !email) {
    throw new ApiError(400, "Email or user name is required.");
  }
  // Alternative solution
  // if (!(username || email)) {
  //   throw new ApiError(400, "Email or user name is required.");
  // }
  // 3. find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User dose not exists.");
  }
  // 4. password check
  const isValidPassword = await user.isValidPassword(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials.");
  }
  // 5. Generate Access or Refresh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // find the updated user he has refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // 6. Set Token to Cookie and Send Response
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});
// Logout user route

const logoutUser = asyncHandler(async (req, res) => {
  //  logout user
  // 1. Inject a middleware that ste the user to req.user
  // 2. find user by req.user._id  and delete refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  // 3. remove all the cookies from the user and send response
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});
export { loginUser, logoutUser, registerUser };
