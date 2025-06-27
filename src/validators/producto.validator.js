const { body } = require("express-validator");

exports.validateProduct = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("descripcion").notEmpty().withMessage("La descripción es requerida"),
  body("precio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero no negativo"),
];
