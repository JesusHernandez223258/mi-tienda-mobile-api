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
  const results = {
    successful: [],
    failed: [],
  };

  // Usamos un bucle for...of para poder usar await dentro
  for (const clientProduct of productsFromClient) {
    try {
      let savedProduct;
      // El cliente nos envía un ID temporal (ej: "local_123")
      const { tempId, ...productData } = clientProduct;

      // Si el producto ya tiene un serverId, es una actualización
      if (productData.serverId) {
        savedProduct = await Producto.findByIdAndUpdate(
          productData.serverId,
          productData,
          { new: true, runValidators: true }
        );
      } else {
        // Si no, es una creación
        savedProduct = await new Producto(productData).save();
      }

      if (savedProduct) {
        const responseObject = {
          tempId: tempId,
          _id: savedProduct._id,
          nombre: savedProduct.nombre,
          descripcion: savedProduct.descripcion,
          precio: savedProduct.precio,
          stock: savedProduct.stock,
          imagenUrl: savedProduct.imagenUrl,
        };
        results.successful.push(responseObject);
      } else {
        // Esto podría pasar si el ID de actualización no se encuentra
        throw new Error("Producto no encontrado para actualizar.");
      }
    } catch (error) {
      results.failed.push({
        tempId: clientProduct.tempId,
        reason: error.message,
      });
    }
  }
  return results;
};

exports.getAllProductsForSync = async () => {
  // Usamos el método estático definido en el modelo para obtener todos los productos, incluyendo inactivos
  return await Producto.findWithInactive();
};

// NUEVA FUNCIÓN PARA SYNC DELTA
exports.getUpdatesSince = async (timestamp) => {
  // Convertir el timestamp del cliente (en milisegundos) a un objeto Date
  const sinceDate = new Date(timestamp);

  // Buscamos todos los productos (incluyendo los inactivos/borrados)
  // que han sido actualizados DESPUÉS de la fecha proporcionada.
  const updatedProducts = await Producto.findWithInactive({
    updatedAt: { $gt: sinceDate },
  });

  // El `timestamp` de respuesta será el del último cambio en el servidor,
  // o la fecha actual si no hay cambios.
  const lastUpdate =
    updatedProducts.length > 0
      ? Math.max(...updatedProducts.map((p) => new Date(p.updatedAt).getTime()))
      : Date.now();

  return {
    products: updatedProducts,
    serverTimestamp: lastUpdate,
  };
};
