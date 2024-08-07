import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

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
  // 4. Check for images, check for avatar
  // 5. Upload to them cloudinary, avatar check
  // 6. Create user object,
  // 7. Create entry in database
  // 8. Remove password and refresh token from response
  // 9. Check for user creation
  // 10. Return response
});

export { registerUser };
