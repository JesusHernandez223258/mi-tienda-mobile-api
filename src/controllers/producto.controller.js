const productoService = require("../services/producto.service");
const { validationResult } = require("express-validator");
const { jsonResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.imagenUrl = `${process.env.API_BASE_URL}/uploads/${req.file.filename}`;
    }
    const product = await productoService.createProduct(productData);
    jsonResponse(res, 201, product, "Producto creado exitosamente");
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await productoService.getAllProducts(page, limit);
    jsonResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productoService.getProductById(req.params.id);
    jsonResponse(res, 200, product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imagenUrl = `${process.env.API_BASE_URL}/uploads/${req.file.filename}`;
    }
    const updatedProduct = await productoService.updateProduct(
      req.params.id,
      updateData
    );
    jsonResponse(res, 200, updatedProduct, "Producto actualizado exitosamente");
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productoService.deleteProduct(req.params.id);
    jsonResponse(res, 200, null, "Producto eliminado exitosamente");
  } catch (error) {
    next(error);
  }
};

exports.syncProducts = async (req, res, next) => {
  try {
    // El body debería ser un array de productos: { "products": [...] }
    const { products } = req.body;

    if (!Array.isArray(products)) {
      throw new ApiError(
        400,
        "El cuerpo de la petición debe contener un array de 'products'."
      );
    }

    const results = await productoService.syncProducts(products);
    jsonResponse(res, 200, results, "Sincronización completada.");
  } catch (error) {
    next(error);
  }
};

exports.getAllProductsForSync = async (req, res, next) => {
  try {
    const products = await productoService.getAllProductsForSync();
    jsonResponse(res, 200, products);
  } catch (error) {
    next(error);
  }
};

