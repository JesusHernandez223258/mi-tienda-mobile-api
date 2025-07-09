// src/routes/producto.routes.js (VERSIÓN FINAL Y CORREGIDA)

const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const verifyToken = require("../middlewares/jwt.middleware");
const checkAdmin = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const { validateProduct } = require("../validators/producto.validator");

// NOTA: Para este tipo de validación, es mejor tener un middleware separado,
// pero por ahora, la dejamos aquí para simplificar.
const checkValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const ApiError = require("../utils/ApiError");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Si hay errores de validación, los pasamos a nuestro manejador de errores central.
    return next(new ApiError(400, "Error de validación", errors.array()));
  }
  next();
};

// Todas las rutas de productos requieren token y rol de admin
router.use(verifyToken, checkAdmin);

router
  .route("/")
  .get(productoController.getAllProducts)
  // Encadenamos middlewares: upload -> validación de body -> chequeo de validación -> controlador
  .post(
    upload,
    validateProduct,
    checkValidation,
    productoController.createProduct
  );

router
  .route("/:id") // <--- ¡ESTA ES LA CORRECCIÓN CLAVE!
  .get(productoController.getProductById)
  .put(
    upload,
    validateProduct,
    checkValidation,
    productoController.updateProduct
  )
  .delete(productoController.deleteProduct);

// NUEVA RUTA: Para sincronización en lote desde la app móvil
router.post("/sync", productoController.syncProducts);

// NUEVA RUTA: Obtener todos los productos, incluyendo inactivos (para admin o sync total)
router.get("/all-for-sync", productoController.getAllProductsForSync);

module.exports = router;
