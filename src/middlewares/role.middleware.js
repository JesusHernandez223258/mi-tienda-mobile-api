const checkAdmin = (req, res, next) => {
  // Este middleware se ejecuta DESPUÉS de verifyToken
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};

module.exports = checkAdmin;
