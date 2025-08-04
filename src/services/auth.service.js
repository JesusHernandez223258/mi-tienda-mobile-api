// src/services/auth.service.js (CORREGIDO)
const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

// FUNCIÓN DE REGISTRO (sin cambios)
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

// FUNCIÓN DE LOGIN (MODIFICADA)
exports.loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user) throw new ApiError(401, "Credenciales inválidas");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Credenciales inválidas");

  // Generar Access Token (corto)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Duración corta
  );

  // Generar Refresh Token (largo)
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // Guardar el refresh token en el usuario
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  };
};

// NUEVA FUNCIÓN PARA REFRESCAR EL TOKEN
exports.refreshToken = async (token) => {
  if (!token) throw new ApiError(401, "Refresh token no proporcionado");

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Usuario.findOne({
      _id: decoded.id,
      "refreshTokens.token": token,
    });

    if (!user) throw new ApiError(403, "Refresh token inválido o revocado");

    // Generar un nuevo access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new ApiError(403, "Refresh token inválido o expirado");
  }
};
