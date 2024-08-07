/**
 * A utility function to wrap asynchronous route handlers.
 * It ensures that any errors are passed to the Express error handler middleware.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} A function that wraps the route handler and handles errors.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(
      fn( req, res, next )
    ).catch( next );
  };
};

export { asyncHandler };
