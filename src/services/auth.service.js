const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");

exports.loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Credenciales inválidas");
    error.statusCode = 401;
    throw error;
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
