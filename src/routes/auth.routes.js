const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");
const { validateLogin } = require("../validators/auth.validator");

// POST /api/v1/auth/login
router.post("/login", validateLogin, login);

// NOTA: Para crear el primer admin, puedes crear un script aparte o una ruta protegida especial.
// router.post('/register-admin', registerAdmin); // Ejemplo

module.exports = router;
