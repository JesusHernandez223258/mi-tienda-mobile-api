const Producto = require("../models/producto.model");

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
  return await Producto.findById(id);
};

exports.updateProduct = async (id, updateData) => {
  return await Producto.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteProduct = async (id) => {
  return await Producto.findByIdAndDelete(id);
};
