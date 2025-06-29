const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Carga las variables de .env

const authRoutes = require("./routes/auth.routes");
const productoRoutes = require("./routes/producto.routes");
// const clienteRoutes = require('./routes/cliente.routes'); // Opcional
// const pedidoRoutes = require('./routes/pedido.routes');   // Opcional
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado exitosamente."))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Rutas de la API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/productos", productoRoutes);
// app.use('/api/v1/clientes', clienteRoutes);
// app.use('/api/v1/pedidos', pedidoRoutes);

// Middleware de manejo de errores (debe ser el último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
