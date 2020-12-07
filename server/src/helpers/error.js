'use strict'

class ErrorHandler extends Error {
   constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
   }
}

class CError extends Error {
   constructor(errorCode, message) {
      super();
      this.errorCode = errorCode;
      this.message = message;
   }
}

const handleError = (err, res) => {
   const { statusCode, message } = err;
   res.status(statusCode).json({
      status: "error",
      statusCode,
      message
   });
};

module.exports = {
   ErrorHandler,
   handleError,
   CError
}