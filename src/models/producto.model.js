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
    categoria: {
      type: String,
      trim: true,
    },
    imagenUrl: {
      type: String,
    },
    // NUEVO CAMPO PARA SOFT DELETE
    isActive: {
      type: Boolean,
      default: true, // Por defecto, todos los productos están activos
    },
  },
  { timestamps: true }
);

// Middleware de Mongoose para que todas las búsquedas (`find`, `findOne`, etc.)
// filtren automáticamente solo los productos activos.
ProductoSchema.pre(/^find/, function (next) {
  // this se refiere a la consulta (query)
  this.where({ isActive: { $ne: false } }); // Excluir documentos donde isActive es false
  next();
});

// Método estático para obtener TODOS los productos, ignorando el hook pre-find.
ProductoSchema.statics.findWithInactive = function () {
  return this.find({ _id: { $exists: true } });
};

module.exports = mongoose.model("Producto", ProductoSchema);
