const { body } = require("express-validator");

exports.validateLogin = [
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").notEmpty().withMessage("La contraseña no puede estar vacía"),
];
