// src/validators/auth.validator.js
const { body } = require("express-validator");
const Usuario = require("../models/usuario.model");

exports.validateLogin = [
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").notEmpty().withMessage("La contraseña no puede estar vacía"),
];

exports.validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),
  body("role")
    .optional()
    .isIn(["admin", "cliente"])
    .withMessage("El rol debe ser 'admin' o 'cliente'."),
];