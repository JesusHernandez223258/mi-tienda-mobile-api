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

router.use(verifyToken, checkAdmin);

router.get("/all-for-sync", productoController.getAllProductsForSync);
router.post("/sync", productoController.syncProducts);

router
  .route("/")
  .get(productoController.getAllProducts)
  .post(
    upload,
    validateProduct,
    checkValidation,
    productoController.createProduct
  );

router
  .route("/:id")
  .get(productoController.getProductById)
  .put(
    upload,
    validateProduct,
    checkValidation,
    productoController.updateProduct
  )
  .delete(productoController.deleteProduct);

module.exports = router;
