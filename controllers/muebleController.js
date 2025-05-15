// Base de datos en memoria
let mueblesDB = {};

// Función para generar un código único si no se proporciona
const generarCodigo = () => {
  return 'M' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

exports.crearMueble = (req, res) => {
  const mueble = req.body;

  // Si no viene código, generamos uno
  if (!mueble.codigoMueble) {
    mueble.codigoMueble = generarCodigo();
  }

  // Verificar si ya existe
  if (mueblesDB[mueble.codigoMueble]) {
    return res.status(400).json({ error: 'El mueble ya existe' });
  }

  mueblesDB[mueble.codigoMueble] = mueble;
  res.status(201).json(mueble);
};

exports.obtenerTodosMuebles = (req, res) => {
  res.json(Object.values(mueblesDB));
};

exports.obtenerMueble = (req, res) => {
  const mueble = mueblesDB[req.params.codigo];
  if (!mueble) {
    return res.status(404).json({ error: 'Mueble no encontrado' });
  }
  res.json(mueble);
};

exports.actualizarMueble = (req, res) => {
  const codigo = req.params.codigo;
  if (!mueblesDB[codigo]) {
    return res.status(404).json({ error: 'Mueble no encontrado' });
  }

  const muebleActualizado = req.body;
  if (muebleActualizado.codigoMueble && muebleActualizado.codigoMueble !== codigo) {
    return res.status(400).json({ error: 'No se puede cambiar el código del mueble' });
  }

  mueblesDB[codigo] = { ...mueblesDB[codigo], ...muebleActualizado };
  res.json(mueblesDB[codigo]);
};

exports.eliminarMueble = (req, res) => {
  const codigo = req.params.codigo;
  if (!mueblesDB[codigo]) {
    return res.status(404).json({ error: 'Mueble no encontrado' });
  }

  delete mueblesDB[codigo];
  res.json({ message: 'Mueble eliminado correctamente' });
};

exports.filtrarMuebles = (req, res) => {
  let resultados = Object.values(mueblesDB);

  // Filtrar por categoría si viene en query params
  if (req.query.categoria) {
    resultados = resultados.filter(m =>
      m.categoria.toLowerCase() === req.query.categoria.toLowerCase()
    );
  }

  // Filtrar por etiqueta si viene en query params
  if (req.query.etiqueta) {
    resultados = resultados.filter(m =>
      m.etiqueta.toLowerCase() === req.query.etiqueta.toLowerCase()
    );
  }

  res.json(resultados);
};
