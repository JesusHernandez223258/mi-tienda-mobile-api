// src/controllers/sync.controller.js
const productoService = require("../services/producto.service");
const { jsonResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

// Sube los cambios del cliente (lo que antes era syncProducts)
exports.syncClientProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      throw new ApiError(
        400,
        "El cuerpo debe contener un array de 'products'."
      );
    }
    const results = await productoService.syncProducts(products);
    jsonResponse(res, 200, results, "Sincronización completada.");
  } catch (error) {
    next(error);
  }
};

// Descarga los cambios del servidor (NUEVA FUNCIONALIDAD)
exports.getClientUpdates = async (req, res, next) => {
  try {
    const { since } = req.query; // Timestamp del último sync del cliente
    if (!since || isNaN(parseInt(since))) {
      throw new ApiError(400, "Se requiere un 'since' timestamp válido.");
    }
    const updates = await productoService.getUpdatesSince(parseInt(since));
    jsonResponse(res, 200, updates);
  } catch (error) {
    next(error);
  }
};
