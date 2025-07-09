const Producto = require("../models/producto.model");
const ApiError = require("../utils/ApiError");
const fs = require("fs");
const path = require("path");

// Helper para borrar una imagen
const deleteImageFile = (imageUrl) => {
  if (imageUrl) {
    const filename = imageUrl.split("/uploads/")[1];
    const imagePath = path.join(__dirname, "../../public/uploads", filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

exports.createProduct = async (productData) => {
  const newProduct = new Producto(productData);
  return await newProduct.save();
};

exports.getAllProducts = async (page, limit) => {
  const skip = (page - 1) * limit;
  const products = await Producto.find().skip(skip).limit(limit);
  const totalProducts = await Producto.countDocuments();
  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};

exports.getProductById = async (id) => {
  const product = await Producto.findById(id);
  if (!product) {
    throw new ApiError(404, "Producto no encontrado");
  }
  return product;
};

exports.updateProduct = async (id, updateData) => {
  // CAMBIO: Lógica para borrar la imagen anterior si se sube una nueva
  if (updateData.imagenUrl) {
    const productToUpdate = await Producto.findById(id);
    if (productToUpdate && productToUpdate.imagenUrl) {
      deleteImageFile(productToUpdate.imagenUrl);
    }
  }

  const updatedProduct = await Producto.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct) {
    throw new ApiError(404, "Producto no encontrado");
  }
  return updatedProduct;
};

exports.deleteProduct = async (id) => {
  // CAMBIO: En lugar de borrar, hacemos un borrado lógico
  const product = await Producto.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new ApiError(404, "Producto no encontrado");
  }
  // No borramos la imagen físicamente, por si se necesita recuperar el producto.
  // Si quieres borrarla, puedes descomentar la siguiente línea:
  // deleteImageFile(product.imagenUrl);

  return product;
};

exports.syncProducts = async (productsFromClient) => {
  const promises = productsFromClient.map((product) => {
    // Si el producto tiene un ID, es una actualización.
    if (product._id) {
      const id = product._id;
      delete product._id; // Quitamos el id del objeto para que no intente actualizarlo
      return Producto.findByIdAndUpdate(id, product, {
        new: true,
        runValidators: true,
        upsert: true,
      });
      // upsert: true -> si no encuentra el ID, lo crea.
    } else {
      // Si no tiene ID, es una creación.
      const newProduct = new Producto(product);
      return newProduct.save();
    }
  });

  const settledPromises = await Promise.allSettled(promises);

  // Devolvemos un reporte de qué se creó/actualizó y qué falló.
  const results = {
    successful: [],
    failed: [],
  };

  settledPromises.forEach((result, index) => {
    const originalProduct = productsFromClient[index];
    if (result.status === "fulfilled") {
      results.successful.push({
        tempId: originalProduct.tempId || null,
        product: result.value,
      });
    } else {
      results.failed.push({
        product: originalProduct,
        reason: result.reason.message,
      });
    }
  });

  return results;
};

exports.getAllProductsForSync = async () => {
  // Usamos el método estático definido en el modelo para obtener todos los productos, incluyendo inactivos
  return await Producto.findWithInactive();
};
