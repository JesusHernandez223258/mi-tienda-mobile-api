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


exports.loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Credenciales inválidas");
  }

  // Generar Access Token (corto)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Duración corta recomendada
  );

  // Generar Refresh Token (largo)
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // ✅ Limpiamos tokens viejos y guardamos el nuevo
  user.refreshTokens = []; // Opcional: si solo permites una sesión a la vez.
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, role: user.role },
  };
};

exports.refreshToken = async (token) => {
  if (!token) throw new ApiError(401, "Refresh token no proporcionado");

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await Usuario.findOne({
      _id: decoded.id,
      "refreshTokens.token": token,
    });

    if (!user) throw new ApiError(403, "Refresh token inválido o revocado");

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("Error al refrescar token:", error);
    // Eliminamos el refresh token guardado en BD
    const user = await Usuario.findOne({ "refreshTokens.token": token });
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== token
      );
      await user.save();
    }
    throw new ApiError(403, "Refresh token inválido o expirado");
  }
};