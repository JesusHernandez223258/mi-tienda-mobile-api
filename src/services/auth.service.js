// src/services/auth.service.js (CORREGIDO)
const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// FUNCIÓN DE REGISTRO (AHORA SE EXPORTA CORRECTAMENTE)
exports.registerUser = async (userData) => {
  const existingUser = await Usuario.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "El email ya está registrado.");
  }

  const newUser = new Usuario(userData);
  await newUser.save();

  const userToReturn = newUser.toObject();
  delete userToReturn.password;

  return userToReturn;
};

// FUNCIÓN DE LOGIN (SEPARADA Y CORRECTA)
exports.loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
