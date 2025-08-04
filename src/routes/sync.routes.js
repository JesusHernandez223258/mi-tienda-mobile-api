// src/routes/sync.routes.js
const express = require("express");
const router = express.Router();
const syncController = require("../controllers/sync.controller");
const verifyToken = require("../middlewares/jwt.middleware");
const checkAdmin = require("../middlewares/role.middleware");

// Todas las rutas de sync requieren un token de admin
router.use(verifyToken, checkAdmin);

// Sube los cambios del cliente al servidor
router.post("/products", syncController.syncClientProducts);

// Descarga los cambios del servidor al cliente desde un timestamp
router.get("/products", syncController.getClientUpdates);

module.exports = router;
