const express = require("express");
const router = express.Router();
const productoController = require("../controllers/producto.controller");
const verifyToken = require("../middlewares/jwt.middleware");
const checkAdmin = require("../middlewares/role.middleware");
const { validateProduct } = require("../validators/producto.validator");

// Todas las rutas de productos requieren token y rol de admin
router.use(verifyToken, checkAdmin);

router
  .route("/")
  .get(productoController.getAllProducts)
  .post(validateProduct, productoController.createProduct);

router
  .route("/:id")
  .get(productoController.getProductById)
  .put(validateProduct, productoController.updateProduct)
  .delete(productoController.deleteProduct);

module.exports = router;
