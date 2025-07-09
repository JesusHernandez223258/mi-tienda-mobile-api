const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError"); // Importamos nuestro error personalizado

exports.loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user) {
    // CAMBIO: Lanzamos un error específico
    throw new ApiError(401, "Credenciales inválidas");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // CAMBIO: Lanzamos un error específico
    throw new ApiError(401, "Credenciales inválidas");
  }

  // Si las credenciales son correctas, generamos el token
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
