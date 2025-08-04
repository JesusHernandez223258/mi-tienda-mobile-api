const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "cliente"],
      default: "cliente",
    },
    // NUEVO CAMPO: refreshTokens
    refreshTokens: [
      {
        token: String,
        // Puedes agregar más campos aquí si lo deseas (ej: device, ip, createdAt)
      },
    ],
  },
  { timestamps: true }
);

// Hook para hashear la contraseña antes de guardarla
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
