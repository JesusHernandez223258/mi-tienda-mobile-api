const authService = require("../services/auth.service");
const { validationResult } = require("express-validator");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.json(data);
  } catch (error) {
    next(error); // Pasa el error al middleware de errores
  }
};
