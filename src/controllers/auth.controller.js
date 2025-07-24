const authService = require("../services/auth.service");
const { validationResult } = require("express-validator");
const { jsonResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

exports.login = async (req, res, next) => {

  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);

    jsonResponse(res, 200, { token, user }, "Login exitoso");
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    // La validación se maneja con el middleware checkValidation en la ruta
    const newUser = await authService.registerUser(req.body);
    jsonResponse(res, 201, newUser, "Usuario registrado exitosamente.");
  } catch (error) {
    next(error);
  }
};