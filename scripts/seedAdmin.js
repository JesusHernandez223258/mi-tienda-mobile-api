// scripts/seedAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("../src/models/usuario.model");
require("dotenv").config({ path: ".env" }); // Asegúrate que la ruta al .env sea correcta

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@tienda.com";
    const adminExists = await Usuario.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("El usuario administrador ya existe.");
      return;
    }

    const admin = new Usuario({
      email: adminEmail,
      password: "test1234", // Cambia esto
      role: "admin",
    });

    await admin.save();
    console.log("Usuario administrador creado exitosamente.");
  } catch (error) {
    console.error("Error creando el usuario administrador:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
