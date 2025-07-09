const mongoose = require("mongoose");
const Usuario = require("../src/models/usuario.model");
require("dotenv").config(); // No necesitas path si .env está en la raíz

/**
 * Script para crear un usuario administrador si no existe.
 * Se conecta a la base de datos, verifica la existencia del admin,
 * lo crea si es necesario y luego cierra la conexión.
 */
const seedAdmin = async () => {
  // 1. Validar que la URI de MongoDB esté configurada
  if (!process.env.MONGO_URI) {
    console.error("Error: La variable de entorno MONGO_URI no está definida.");
    console.log(
      "Asegúrate de tener un archivo .env en la raíz del proyecto con la configuración necesaria."
    );
    process.exit(1); // Salir del script con un código de error
  }

  try {
    // 2. Conectar a la base de datos
    console.log("Conectando a la base de datos...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa.");

    // 3. Definir los datos del administrador
    const adminData = {
      email: "admin@tienda.com",
      password: "test1234", // Usa la misma contraseña que en tus pruebas de UI para consistencia
      role: "admin",
    };

    // 4. Verificar si el administrador ya existe
    const adminExists = await Usuario.findOne({ email: adminData.email });

    if (adminExists) {
      console.log(
        `El usuario administrador con email '${adminData.email}' ya existe.`
      );
      return; // No hacer nada más
    }

    // 5. Si no existe, crear el nuevo usuario
    console.log(
      `Creando usuario administrador con email '${adminData.email}'...`
    );
    // Mongoose se encargará de hashear la contraseña gracias al hook 'pre-save' en el modelo
    const admin = new Usuario(adminData);
    await admin.save();

    console.log("✅ ¡Usuario administrador creado exitosamente!");
  } catch (error) {
    // 6. Manejar errores de conexión o guardado
    console.error(
      "❌ Error durante la ejecución del script de seeding:",
      error
    );
    process.exit(1);
  } finally {
    // 7. Asegurar que la conexión siempre se cierre
    console.log("Cerrando la conexión a la base de datos...");
    await mongoose.connection.close();
    console.log("Conexión cerrada.");
  }
};

// Ejecutar la función principal
seedAdmin();
