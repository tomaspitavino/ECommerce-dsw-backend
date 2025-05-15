exports.validarMueble = (req, res, next) => {
  const mueble = req.body;

  // Validación básica de campos requeridos
  if (!mueble.descripcion || !mueble.precioUnitario || !mueble.stock) {
    return res.status(400).json({
      error: 'Descripción, precio unitario y stock son campos requeridos'
    });
  }

  // Validar que el precio sea número positivo
  if (isNaN(mueble.precioUnitario) || mueble.precioUnitario <= 0) {
    return res.status(400).json({
      error: 'El precio unitario debe ser un número positivo'
    });
  }

  // Validar que el stock sea entero positivo
  if (!Number.isInteger(mueble.stock) || mueble.stock < 0) {
    return res.status(400).json({
      error: 'El stock debe ser un entero positivo'
    });
  }

  next();
};
