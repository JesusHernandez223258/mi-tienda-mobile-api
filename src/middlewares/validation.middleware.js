// src/middlewares/validation.middleware.js
const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores de validación, los pasamos a nuestro manejador de errores central.
    return next(new ApiError(400, "Error de validación", errors.array()));
  }
  next();
};

module.exports = checkValidation;
