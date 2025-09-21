// = throw new Error("Somthing went wrong");
//Ví dụ: throw new Error("User not found") == throw new ApiError(404, "User not found");
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

module.exports = ApiError
