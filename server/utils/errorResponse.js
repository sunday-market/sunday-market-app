class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // reference variable to the parent class (Error)
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
