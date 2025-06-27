const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    // Opcional: una categoría o imagen
    categoria: {
      type: String,
      trim: true,
    },
    imagenUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", ProductoSchema);
