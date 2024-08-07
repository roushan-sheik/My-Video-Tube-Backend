import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //  Write down ths steps
  // 1. Get user details from frontend
  // 2. Validation - not empty
  // 3. Check user is already exists: name , email
  // 4. Check for images, check for avatar
  // 5. Upload to them cloudinary, avatar check
  // 6. Create user object,
  // 7. Create entry in database
  // 8. Remove password and refresh token from response
  // 9. Check for user creation
  // 10. Return response
  const { username, fullName, email, password } = req.body;
});

export { registerUser };
