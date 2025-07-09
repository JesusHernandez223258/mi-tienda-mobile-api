const authService = require("../services/auth.service");
const { validationResult } = require("express-validator");
const { jsonResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Error de validación", errors.array()));
  }

  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);

    // CAMBIO: Usamos nuestro manejador de respuestas
    // y enviamos el token en el cuerpo para facilitar la prueba en la UI
    jsonResponse(res, 200, { token, user }, "Login exitoso");
  } catch (error) {
    next(error);
  }
};
