//**NOTE -  Try catch way
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};

export { asyncHandler };
