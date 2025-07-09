// src/utils/response.handler.js

const jsonResponse = (res, statusCode, data, message = "Operación exitosa") => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    status: "error",
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
};

module.exports = {
  jsonResponse,
  errorResponse,
};
