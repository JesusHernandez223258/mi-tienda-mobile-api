// src/middlewares/errorHandler.middleware.js

const { errorResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  console.error(err); // Es bueno loguear el error completo

  if (err instanceof ApiError) {
    // CAMBIO: Pasamos el array de errores a la respuesta
    return errorResponse(res, err.statusCode, err.message, err.errors);
  }

  if (
    err.code === "LIMIT_FILE_SIZE" ||
    (err.message &&
      err.message.includes("El tipo de archivo no está permitido"))
  ) {
    return errorResponse(res, 400, err.message);
  }

  errorResponse(res, 500, "Ha ocurrido un error interno en el servidor.");
};

module.exports = errorHandler;
