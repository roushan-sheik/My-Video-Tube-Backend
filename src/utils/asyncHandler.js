import { Promise } from "mongoose";

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};


export { asyncHandler };

//**NOTE -  Try catch way
// const asyncHandler = (func) => async (req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch (error) {
//     res.status(error.status).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export { asyncHandler };
