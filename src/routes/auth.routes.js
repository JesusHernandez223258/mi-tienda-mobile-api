// src/routes/auth.routes.js (CORREGIDO)
const express = require("express");
const router = express.Router();

// --- IMPORTACIONES NECESARIAS ---
const { login, register } = require("../controllers/auth.controller");
const {
  validateLogin,
  validateRegister,
} = require("../validators/auth.validator");
const checkValidation = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/jwt.middleware");
const checkAdmin = require("../middlewares/role.middleware");

// --- RUTAS ---

// Ruta pública para Login
router.post("/login", validateLogin, checkValidation, login);

// Ruta protegida para registrar nuevos usuarios (solo admins)
router.post(
  "/register",
  validateRegister,
  checkValidation,
  register
);

module.exports = router;
