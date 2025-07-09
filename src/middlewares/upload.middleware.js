// src/middlewares/upload.middleware.js
const multer = require("multer");
const path = require("path");

// Definir dónde se guardarán los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // La carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    // Crear un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filtrar para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(
    new Error(
      "Error: El tipo de archivo no está permitido. Solo se aceptan imágenes (jpeg, jpg, png, gif)."
    )
  );
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB por archivo
  fileFilter: fileFilter,
});

// Exportamos un middleware para un solo archivo, esperado en el campo 'imagen'
module.exports = upload.single("imagen");
