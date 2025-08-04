const productoService = require("../services/producto.service");
const { jsonResponse } = require("../utils/response.handler");
const ApiError = require("../utils/ApiError");

// --- URL BASE PARA EL EMULADOR DE ANDROID ---
// Esta IP es una dirección especial que desde el emulador apunta al 'localhost' de la máquina anfitriona.
const API_BASE_URL_FOR_EMULATOR = "http://10.0.2.2:3000";

/**
 * Construye la URL completa de la imagen.
 * Usa la URL del emulador para que la app móvil pueda acceder a ella directamente.
 */
const buildImageUrl = (filename) => {
  return `${API_BASE_URL_FOR_EMULATOR}/uploads/${filename}`;
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.imagenUrl = buildImageUrl(req.file.filename);
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
      updateData.imagenUrl = buildImageUrl(req.file.filename);
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

// --- Endpoints de Sincronización ---

exports.syncProducts = async (req, res, next) => {
  try {
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
