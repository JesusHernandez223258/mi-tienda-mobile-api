const productoService = require("../services/producto.service");
const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

exports.createProduct = async (req, res, next) => {
  if (handleValidationErrors(req, res)) return;
  try {
    const product = await productoService.createProduct(req.body);
    res.status(201).json({ message: "Producto creado exitosamente", product });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    // Leer page y limit de los query params, con valores por defecto
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await productoService.getAllProducts(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productoService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  if (handleValidationErrors(req, res)) return;
  try {
    const updatedProduct = await productoService.updateProduct(
      req.params.id,
      req.body
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res
      .status(200)
      .json({
        message: "Producto actualizado exitosamente",
        product: updatedProduct,
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productoService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};
