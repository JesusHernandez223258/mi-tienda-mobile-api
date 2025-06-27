const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

const verifyToken = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Extraer el token del header
      token = authHeader.split(" ")[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjuntar el usuario (sin la contraseña) al request
      req.user = await Usuario.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token no válido o expirado" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No autorizado, token no encontrado" });
  }
};

module.exports = verifyToken;
